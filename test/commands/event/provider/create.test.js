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
const inquirer = require('inquirer')
const ProviderCreateCommand = require('../../../../src/commands/event/provider/create')

test('exports', async () => {
  expect(typeof ProviderCreateCommand).toEqual('function')
  expect(ProviderCreateCommand.prototype instanceof Command).toBeTruthy()
})

test('description', async () => {
  expect(ProviderCreateCommand.description).toBeDefined()
})

test('flags', async () => {
  expect(ProviderCreateCommand.flags.help.type).toBe('boolean')
  expect(ProviderCreateCommand.flags.version.type).toBe('boolean')
  expect(ProviderCreateCommand.flags.verbose.type).toBe('boolean')
  expect(ProviderCreateCommand.flags.json.char).toBe('j')
  expect(ProviderCreateCommand.flags.json.exclusive).toEqual(['yml'])
  expect(ProviderCreateCommand.flags.yml.type).toBe('boolean')
  expect(ProviderCreateCommand.flags.yml.char).toBe('y')
  expect(ProviderCreateCommand.flags.yml.exclusive).toEqual(['json'])
})

test('args', async () => {
  expect(ProviderCreateCommand.args).toBeUndefined()
})

describe('console:provider:create', () => {
  let command

  beforeEach(async () => {
    command = new ProviderCreateCommand([])
    inquirer.prompt = jest.fn()
    command.conf = {
      org: {
        id: 'ORGID'
      },
      project: {
        id: 'PROJECTID'
      },
      workspace: {
        id: 'WORKSPACEID'
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('exists', async () => {
    expect(command.run).toBeInstanceOf(Function)
  })

  describe('successfully create provider', () => {
    beforeEach(async () => {
      command.initSdk = jest.fn()
      command.eventClient = { createProvider: jest.fn().mockReturnValue(mock.data.getProviderByIdResponse) }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should create a provider and return response', async () => {
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL01', description: 'DESC01', docs_url: 'DOCS01' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('provider/create.txt')
    })

    test('should create a provider and return response for empty desc and docs', async () => {
      command.eventClient = { createProvider: jest.fn().mockReturnValue(mock.data.createProviderWithoutDescAndDocsUrlResponse) }
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL01', description: '', docs_url: '' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('provider/emptyDescCreate.txt')
    })

    test('should create a provider and return response as json', async () => {
      command.argv = ['--json']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL01', description: 'DESC01', docs_url: 'DOCS01' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(JSON.parse(stdout.output)).toMatchFixtureJson('provider/create.json')
    })

    test('should create a provider and return response as yaml', async () => {
      command.argv = ['--yml']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL01', description: 'DESC01', docs_url: 'DOCS01' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('provider/create.yml')
    })
  })

  describe('fail to create provider', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { createProvider: jest.fn().mockRejectedValue('Error creating provider') }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return error on create provider', async () => {
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL01', description: 'DESC01', docs_url: 'DOCS01' })
      await expect(command.run()).rejects.toThrowError(new Error('Error creating provider'))
    })
  })
})
