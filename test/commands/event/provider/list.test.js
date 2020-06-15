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
const ProviderListCommand = require('../../../../src/commands/event/provider/list')

test('exports', async () => {
  expect(typeof ProviderListCommand).toEqual('function')
  expect(ProviderListCommand.prototype instanceof Command).toBeTruthy()
})

test('description', async () => {
  expect(ProviderListCommand.description).toBeDefined()
})

test('flags', async () => {
  expect(ProviderListCommand.flags.help.type).toBe('boolean')
  expect(ProviderListCommand.flags.version.type).toBe('boolean')
  expect(ProviderListCommand.flags.verbose.type).toBe('boolean')
  expect(ProviderListCommand.flags.json.char).toBe('j')
  expect(ProviderListCommand.flags.json.exclusive).toEqual(['yml'])
  expect(ProviderListCommand.flags.yml.type).toBe('boolean')
  expect(ProviderListCommand.flags.yml.char).toBe('y')
  expect(ProviderListCommand.flags.yml.exclusive).toEqual(['json'])
})

test('args', async () => {
  expect(ProviderListCommand.args).toBeUndefined()
})

describe('console:provider:list', () => {
  let command

  beforeEach(async () => {
    command = new ProviderListCommand([])
    command.conf = {
      org: {
        id: 'ORGID'
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('exists', async () => {
    expect(command.run).toBeInstanceOf(Function)
  })

  describe('successfully list providers', () => {
    beforeEach(async () => {
      command.initSdk = jest.fn()
      command.eventClient = { getAllProviders: jest.fn().mockReturnValue(mock.data.getAllProvidersResponse) }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return list of providers', async () => {
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('provider/list.txt')
    })

    test('should return list of providers as json', async () => {
      command.argv = ['--json']
      await expect(command.run()).resolves.not.toThrowError()
      expect(JSON.parse(stdout.output)).toMatchFixtureJson('provider/list.json')
    })

    test('should return list of providers as yaml', async () => {
      command.argv = ['--yml']
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('provider/list.yml')
    })
  })

  describe('fail to fetch list of providers', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { getAllProviders: jest.fn().mockRejectedValue('Error retrieving providers') }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return error on get list of providers', async () => {
      await expect(command.run()).rejects.toThrowError(new Error('Error retrieving providers'))
    })
  })
})
