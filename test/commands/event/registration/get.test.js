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
const TheCommand = require('../../../../src/commands/event/registration/get')

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

describe('console:registration:get', () => {
  let command

  beforeEach(async () => {
    command = new TheCommand([])
    command.conf = {
      org: { id: 'ORGID' },
      project: { id: 'PROJECTID' },
      workspace: { id: 'WORKSPACEID' },
      integration: { id: 'INTEGRATIONID', jwtClientId: 'CLIENTID' }
    }
    command.initSdk = jest.fn()
  })

  test('exists', async () => {
    expect(command.run).toBeInstanceOf(Function)
  })

  describe('successfully get registration', () => {
    beforeEach(async () => {
      command.eventClient = { getWebhookRegistration: jest.fn().mockReturnValue(mock.data.getWebhookRegistrationResponse) }
    })

    test('registrationId', async () => {
      command.argv = ['registrationId']
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('registration/get.txt')
      expect(command.eventClient.getWebhookRegistration).toHaveBeenCalledWith('ORGID', 'INTEGRATIONID', 'registrationId')
    })

    test('registrationId --json', async () => {
      command.argv = ['registrationId', '--json']
      await expect(command.run()).resolves.not.toThrowError()
      expect(JSON.parse(stdout.output)).toMatchFixtureJson('registration/get.json')
      expect(command.eventClient.getWebhookRegistration).toHaveBeenCalledWith('ORGID', 'INTEGRATIONID', 'registrationId')
    })

    test('registrationId --yml', async () => {
      command.argv = ['registrationId', '--yml']
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('registration/get.yml')
      expect(command.eventClient.getWebhookRegistration).toHaveBeenCalledWith('ORGID', 'INTEGRATIONID', 'registrationId')
    })
  })

  describe('fail to fetch event metadata', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { getWebhookRegistration: jest.fn().mockRejectedValue(new Error('fake error')) }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('registrationId with error', async () => {
      command.argv = ['registrationId']
      await expect(command.run()).rejects.toThrow('fake error')
    })
  })
})
