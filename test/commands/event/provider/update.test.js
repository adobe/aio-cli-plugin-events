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
const ProviderUpdateCommand = require('../../../../src/commands/event/provider/update')

test('exports', async () => {
  expect(typeof ProviderUpdateCommand).toEqual('function')
  expect(ProviderUpdateCommand.prototype instanceof Command).toBeTruthy()
})

test('description', async () => {
  expect(ProviderUpdateCommand.description).toBeDefined()
})

test('flags', async () => {
  expect(ProviderUpdateCommand.flags.help.type).toBe('boolean')
  expect(ProviderUpdateCommand.flags.version.type).toBe('boolean')
  expect(ProviderUpdateCommand.flags.verbose.type).toBe('boolean')
  expect(ProviderUpdateCommand.flags.json.char).toBe('j')
  expect(ProviderUpdateCommand.flags.json.exclusive).toEqual(['yml'])
  expect(ProviderUpdateCommand.flags.yml.type).toBe('boolean')
  expect(ProviderUpdateCommand.flags.yml.char).toBe('y')
  expect(ProviderUpdateCommand.flags.yml.exclusive).toEqual(['json'])
})

describe('console:provider:update', () => {
  let command

  beforeEach(async () => {
    command = new ProviderUpdateCommand([])
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

  describe('successfully update provider', () => {
    beforeEach(async () => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { updateProvider: jest.fn().mockReturnValue(mock.data.getProviderUpdateResponse) }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should update a provider and return response', async () => {
      command.argv = ['providerId']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL04', description: 'DESC04', docs_url: 'DOCS01' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('provider/update.txt')
    })

    test('should update a provider and return response for empty desc and docs', async () => {
      command.argv = ['providerId']
      command.eventClient = { updateProvider: jest.fn().mockReturnValue(mock.data.updateProviderWithoutDescAndDocsUrlResponse) }
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL04', description: '', docs_url: '' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('provider/emptyDescUpdate.txt')
    })

    test('should update a provider and return response as json', async () => {
      command.argv = ['providerId', '--json']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL04', description: 'DESC04', docs_url: 'DOCS01' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(JSON.parse(stdout.output)).toMatchFixtureJson('provider/update.json')
    })

    test('should update a provider and return response as yaml', async () => {
      command.argv = ['providerId', '--yml']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL04', description: 'DESC04', docs_url: 'DOCS01' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('provider/update.yml')
    })
  })

  describe('fail to update provider', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { updateProvider: jest.fn().mockRejectedValue('Error updating provider') }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return error on update provider', async () => {
      command.argv = ['providerId']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL04', description: 'DESC04', docs_url: 'DOCS01' })
      await expect(command.run()).rejects.toThrowError(new Error('Error updating provider'))
    })
  })
})
