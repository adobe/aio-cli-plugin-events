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
const TheCommand = require('../../../../src/commands/event/registration/list')

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
  expect(TheCommand.args).toBeUndefined()
})

describe('console:registration:list', () => {
  let command

  beforeEach(async () => {
    command = new TheCommand([])
    command.conf = {
      org: { id: 'ORGID' },
      project: { id: 'PROJECTID' },
      workspace: { id: 'WORKSPACEID' },
      integration: { id: 'INTEGRATIONID', clientId: 'CLIENTID' }
    }
    command.initSdk = jest.fn()
  })

  test('exists', async () => {
    expect(command.run).toBeInstanceOf(Function)
  })

  describe('successfully get event metadata', () => {
    beforeEach(async () => {
      command.eventClient = { getAllRegistrationsForWorkspace: jest.fn().mockReturnValue(mock.data.getAllWebhookRegistrationsResponse) }
    })

    test('no flags', async () => {
      command.argv = []
      await command.run()
      expect(stdout.output).toMatchFixture('registration/list.txt')
      expect(command.eventClient.getAllRegistrationsForWorkspace).toHaveBeenCalledWith('ORGID', 'PROJECTID', 'WORKSPACEID')
    })

    test('--json', async () => {
      command.argv = ['--json']
      await expect(command.run()).resolves.not.toThrow()
      expect(JSON.parse(stdout.output)).toMatchFixtureJson('registration/list.json')
      expect(command.eventClient.getAllRegistrationsForWorkspace).toHaveBeenCalledWith('ORGID', 'PROJECTID', 'WORKSPACEID')
    })

    test('registrationId --yml', async () => {
      command.argv = ['--yml']
      await expect(command.run()).resolves.not.toThrow()
      expect(stdout.output).toMatchFixture('registration/list.yml')
      expect(command.eventClient.getAllRegistrationsForWorkspace).toHaveBeenCalledWith('ORGID', 'PROJECTID', 'WORKSPACEID')
    })
  })

  describe('fail to fetch event metadata', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { getAllRegistrationsForWorkspace: jest.fn().mockRejectedValue(new Error('fake error')) }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('registrationId with error', async () => {
      command.argv = []
      await expect(command.run()).rejects.toThrow('fake error')
    })
  })
})
