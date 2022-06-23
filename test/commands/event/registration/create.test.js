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
const { Command } = require('@oclif/core')
const { stdout } = require('stdout-stderr')
const mock = require('../../../mocks')
const inquirer = require('inquirer')
const TheCommand = require('../../../../src/commands/event/registration/create')

const jsonToBuffer = json => Buffer.from(JSON.stringify(json))
const mockFs = require('fs')

test('exports', async () => {
  expect(typeof TheCommand).toEqual('function')
  expect(TheCommand.prototype instanceof Command).toBeTruthy()
})

test('description', async () => {
  expect(TheCommand.description).toBeDefined()
})

test('flags', async () => {
  expect(TheCommand.flags.help.type).toBe('boolean')
  expect(TheCommand.flags.version.type).toBe('boolean')
  expect(TheCommand.flags.verbose.type).toBe('boolean')
  expect(TheCommand.flags.json.char).toBe('j')
  expect(TheCommand.flags.json.exclusive).toEqual(['yml'])
  expect(TheCommand.flags.yml.type).toBe('boolean')
  expect(TheCommand.flags.yml.char).toBe('y')
  expect(TheCommand.flags.yml.exclusive).toEqual(['json'])
})

test('args', async () => {
  expect(TheCommand.args[0].required).toBe(true)
  expect(TheCommand.args[0].description).toBeDefined()
})

describe('console:registration:create', () => {
  let command

  beforeEach(async () => {
    command = new TheCommand([])
    inquirer.prompt = jest.fn()
    command.initSdk = jest.fn()
    mockFs.readFileSync.mockReset()
    command.conf = {
      org: { id: 'ORGID' },
      project: { id: 'PROJECTID' },
      workspace: { id: 'WORKSPACEID' },
      integration: { id: 'INTEGRATIONID', jwtClientId: 'CLIENTID' }
    }
  })

  test('exists', async () => {
    expect(command.run).toBeInstanceOf(Function)
  })

  describe('success test cases', () => {
    beforeEach(async () => {
      command.eventClient = { createWebhookRegistration: jest.fn().mockReturnValue(mock.data.createWebhookRegistrationResponse) }
    })

    test('with valid input file fakefile.json', async () => {
      command.argv = ['fakefile.json']
      mockFs.readFileSync.mockReturnValue(jsonToBuffer(mock.data.createWebhookRegistrationInputJSON))
      await command.run()
      expect(command.eventClient.createWebhookRegistration).toHaveBeenCalledWith('ORGID', 'INTEGRATIONID', mock.data.createWebhookRegistrationInputJSON)
      expect(stdout.output).toMatchFixture('registration/create.txt')
    })

    test('with valid input file fakefile.json, missing clientId', async () => {
      command.argv = ['fakefile.json']
      mockFs.readFileSync.mockReturnValue(jsonToBuffer(mock.data.createWebhookRegistrationInputJSONNoClientId))
      await command.run()
      expect(command.eventClient.createWebhookRegistration).toHaveBeenCalledWith('ORGID', 'INTEGRATIONID', { ...mock.data.createWebhookRegistrationInputJSON, client_id: 'CLIENTID' })
    })

    test('fakefile.json --json', async () => {
      command.argv = ['fakefile.json', '--json']
      mockFs.readFileSync.mockReturnValue(jsonToBuffer(mock.data.createWebhookRegistrationInputJSON))
      await command.run()
      expect(command.eventClient.createWebhookRegistration).toHaveBeenCalledWith('ORGID', 'INTEGRATIONID', mock.data.createWebhookRegistrationInputJSON)
      expect(JSON.parse(stdout.output)).toMatchFixtureJson('registration/create.json')
    })

    test('fakefile.json --yml', async () => {
      command.argv = ['fakefile.json', '--yml']
      mockFs.readFileSync.mockReturnValue(jsonToBuffer(mock.data.createWebhookRegistrationInputJSON))
      await command.run()
      expect(command.eventClient.createWebhookRegistration).toHaveBeenCalledWith('ORGID', 'INTEGRATIONID', mock.data.createWebhookRegistrationInputJSON)
      expect(stdout.output).toMatchFixture('registration/create.yml')
    })
  })

  describe('failure test cases', () => {
    beforeEach(() => {
      command.eventClient = { createWebhookRegistration: jest.fn().mockRejectedValue(new Error('Error fake')) }
    })
    test('throw error on bad JSON input file', async () => {
      command.argv = ['fakefile.json']
      mockFs.readFileSync.mockReturnValue(jsonToBuffer(mock.data.createWebhookRegistrationInputJSON))
      await expect(command.run()).rejects.toThrow('Error fake')
    })
    test('throw error on failed registration', async () => {
      command.argv = ['fakefile.json']
      mockFs.readFileSync.mockReturnValue(Buffer.from('bad file'))
      await expect(command.run()).rejects.toThrow('fakefile.json is not a valid JSON file')
    })
  })
})
