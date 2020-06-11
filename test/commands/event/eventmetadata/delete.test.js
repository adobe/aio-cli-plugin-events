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
const EventmetadataDeleteCommand = require('../../../../src/commands/event/eventmetadata/delete')

test('exports', async () => {
  expect(typeof EventmetadataDeleteCommand).toEqual('function')
  expect(EventmetadataDeleteCommand.prototype instanceof Command).toBeTruthy()
})

test('description', async () => {
  expect(EventmetadataDeleteCommand.description).toBeDefined()
})

test('flags', async () => {
  expect(EventmetadataDeleteCommand.flags.help.type).toBe('boolean')
  expect(EventmetadataDeleteCommand.flags.version.type).toBe('boolean')
  expect(EventmetadataDeleteCommand.flags.verbose.type).toBe('boolean')
})

describe('console:eventmetadata:delete', () => {
  let command

  beforeEach(async () => {
    command = new EventmetadataDeleteCommand([])
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

  describe('successfully delete event metadata', () => {
    beforeEach(async () => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { deleteProvider: jest.fn().mockReturnValue('OK') }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should delete all event metadata', async () => {
      command.argv = ['providerId']
      command.eventClient = { deleteAllEventMetadata: jest.fn().mockReturnValue('OK') }
      inquirer.prompt.mockResolvedValueOnce({ delete: true })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toBe('All event metadata of provider providerId has been deleted successfully\n')
    })
    test('should delete one event metadata', async () => {
      command.argv = ['providerId', 'com.adobe.CODE01']
      command.eventClient = { deleteEventMetadata: jest.fn().mockReturnValue('OK') }
      inquirer.prompt.mockResolvedValueOnce({ delete: true })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toBe('com.adobe.CODE01 event metadata of provider providerId has been deleted successfully\n')
    })

    test('cancel delete all event metadata', async () => {
      command.argv = ['providerId']
      inquirer.prompt.mockResolvedValueOnce({ delete: false })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toBe('Deletion operation has been cancelled. For more information on delete use --help\n')
    })
    test('cancel delete one event metadata', async () => {
      command.argv = ['providerId', 'com.adobe.CODE01']
      inquirer.prompt.mockResolvedValueOnce({ delete: false })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toBe('Deletion operation has been cancelled. For more information on delete use --help\n')
    })
  })

  describe('fail to delete event metadata', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return error on delete all event metadata', async () => {
      command.argv = ['providerId']
      inquirer.prompt.mockResolvedValueOnce({ delete: true })
      command.eventClient = { deleteAllEventMetadata: jest.fn().mockRejectedValue('Error deleting all event metadata') }
      await expect(command.run()).rejects.toThrowError(new Error('Error deleting all event metadata'))
    })

    test('should return error on delete one event metadata', async () => {
      command.argv = ['providerId', 'com.adobe.CODE01']
      command.eventClient = { deleteEventMetadata: jest.fn().mockRejectedValue('Error deleting event metadata') }
      inquirer.prompt.mockResolvedValueOnce({ delete: true })
      await expect(command.run()).rejects.toThrowError(new Error('Error deleting event metadata'))
    })
  })
})
