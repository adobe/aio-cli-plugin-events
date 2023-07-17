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
const TheCommand = require('../../../../src/commands/event/registration/delete')
const inquirer = require('inquirer')

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
})

test('args', async () => {
  expect(TheCommand.args[0].required).toBe(true)
  expect(TheCommand.args[0].description).toBeDefined()
})

describe('console:registration:delete', () => {
  let command

  beforeEach(async () => {
    inquirer.prompt = jest.fn()
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
      command.eventClient = { deleteRegistration: jest.fn().mockReturnValue('OK') }
    })

    test('registrationId', async () => {
      command.argv = ['registrationId']
      inquirer.prompt.mockResolvedValueOnce({ delete: true })
      await command.run()
      expect(stdout.output).toMatch('Registration registrationId has been deleted successfully')
      expect(command.eventClient.deleteRegistration).toHaveBeenCalledWith('ORGID', 'PROJECTID', 'WORKSPACEID', 'registrationId')
    })

    test('cancel delete provider', async () => {
      command.argv = ['providerId']
      inquirer.prompt.mockResolvedValueOnce({ delete: false })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toBe('Delete operation has been cancelled\n')
      expect(command.eventClient.deleteRegistration).not.toHaveBeenCalled()
    })
  })

  describe('fail to fetch event metadata', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { deleteRegistration: jest.fn().mockRejectedValue(new Error('fake error')) }
    })

    test('registrationId with error', async () => {
      command.argv = ['registrationId']
      inquirer.prompt.mockResolvedValueOnce({ delete: true })
      await expect(command.run()).rejects.toThrow('fake error')
    })
  })
})
