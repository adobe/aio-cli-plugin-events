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
const inquirer = require('inquirer')
const ProviderDeleteCommand = require('../../../../src/commands/event/provider/delete')

test('exports', async () => {
  expect(typeof ProviderDeleteCommand).toEqual('function')
  expect(ProviderDeleteCommand.prototype instanceof Command).toBeTruthy()
})

test('description', async () => {
  expect(ProviderDeleteCommand.description).toBeDefined()
})

test('flags', async () => {
  expect(ProviderDeleteCommand.flags.help.type).toBe('boolean')
  expect(ProviderDeleteCommand.flags.version.type).toBe('boolean')
  expect(ProviderDeleteCommand.flags.verbose.type).toBe('boolean')
})

describe('console:provider:delete', () => {
  let command

  beforeEach(async () => {
    command = new ProviderDeleteCommand([])
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

  describe('successfully delete provider', () => {
    beforeEach(async () => {
      command.initSdk = jest.fn()
      command.argv = ['providerId']
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { deleteProvider: jest.fn().mockReturnValue('OK') }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should delete provider', async () => {
      command.argv = ['providerId']
      inquirer.prompt.mockResolvedValueOnce({ delete: true })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toBe('Provider providerId has been deleted successfully\n')
    })

    test('cancel delete provider', async () => {
      command.argv = ['providerId']
      inquirer.prompt.mockResolvedValueOnce({ delete: false })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toBe('Delete operation has been cancelled\n')
    })
  })

  describe('fail to delete provider', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { deleteProvider: jest.fn().mockRejectedValue('Error deleting provider') }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return error on delete provider', async () => {
      command.argv = ['providerId']
      inquirer.prompt.mockResolvedValueOnce({ delete: true })
      await expect(command.run()).rejects.toThrowError(new Error('Error deleting provider'))
    })
  })
})
