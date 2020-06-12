/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { Command } = require('@oclif/command')
const { stdout } = require('stdout-stderr')
const mock = require('../../../mocks')
const ProviderGetCommand = require('../../../../src/commands/event/provider/get')

test('exports', async () => {
  expect(typeof ProviderGetCommand).toEqual('function')
  expect(ProviderGetCommand.prototype instanceof Command).toBeTruthy()
})

test('description', async () => {
  expect(ProviderGetCommand.description).toBeDefined()
})

test('flags', async () => {
  expect(ProviderGetCommand.flags.fetchEventMetadata.type).toBe('boolean')
  expect(ProviderGetCommand.flags.help.type).toBe('boolean')
  expect(ProviderGetCommand.flags.version.type).toBe('boolean')
  expect(ProviderGetCommand.flags.verbose.type).toBe('boolean')
  expect(ProviderGetCommand.flags.json.char).toBe('j')
  expect(ProviderGetCommand.flags.json.exclusive).toEqual(['yml'])
  expect(ProviderGetCommand.flags.yml.type).toBe('boolean')
  expect(ProviderGetCommand.flags.yml.char).toBe('y')
  expect(ProviderGetCommand.flags.yml.exclusive).toEqual(['json'])
})

test('args', async () => {
  expect(ProviderGetCommand.args[0].required).toBe(true)
  expect(ProviderGetCommand.args[0].description).toBeDefined()
})

describe('console:provider:get', () => {
  let command

  beforeEach(async () => {
    command = new ProviderGetCommand([])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('exists', async () => {
    expect(command.run).toBeInstanceOf(Function)
  })

  describe('successfully get provider', () => {
    beforeEach(async () => {
      command.initSdk = jest.fn()
      command.argv = ['providerId']
      command.eventClient = { getProvider: jest.fn().mockReturnValue(mock.data.getProviderByIdResponse) }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return a provider', async () => {
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('provider/get.txt')
    })

    test('should return provider as json', async () => {
      command.argv = ['providerId', '--json']
      await expect(command.run()).resolves.not.toThrowError()
      expect(JSON.parse(stdout.output)).toMatchFixtureJson('provider/get.json')
    })

    test('should return provider as yaml', async () => {
      command.argv = ['providerId', '--yml']
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('provider/get.yml')
    })
  })

  describe('fail to fetch provider', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { getProvider: jest.fn().mockRejectedValue('Error retrieving provider') }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return error on get provider', async () => {
      command.argv = ['providerId']
      await expect(command.run()).rejects.toThrowError(new Error('Error retrieving provider'))
    })
  })
})
