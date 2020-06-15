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
const EventmetadataUpdateCommand = require('../../../../src/commands/event/eventmetadata/update')

test('exports', async () => {
  expect(typeof EventmetadataUpdateCommand).toEqual('function')
  expect(EventmetadataUpdateCommand.prototype instanceof Command).toBeTruthy()
})

test('description', async () => {
  expect(EventmetadataUpdateCommand.description).toBeDefined()
})

test('flags', async () => {
  expect(EventmetadataUpdateCommand.flags.help.type).toBe('boolean')
  expect(EventmetadataUpdateCommand.flags.version.type).toBe('boolean')
  expect(EventmetadataUpdateCommand.flags.verbose.type).toBe('boolean')
  expect(EventmetadataUpdateCommand.flags.json.char).toBe('j')
  expect(EventmetadataUpdateCommand.flags.json.exclusive).toEqual(['yml'])
  expect(EventmetadataUpdateCommand.flags.yml.type).toBe('boolean')
  expect(EventmetadataUpdateCommand.flags.yml.char).toBe('y')
  expect(EventmetadataUpdateCommand.flags.yml.exclusive).toEqual(['json'])
})

test('args', async () => {
  expect(EventmetadataUpdateCommand.args[0].required).toBe(true)
  expect(EventmetadataUpdateCommand.args[0].description).toBeDefined()
  expect(EventmetadataUpdateCommand.args[1].required).toBe(true)
  expect(EventmetadataUpdateCommand.args[1].description).toBeDefined()
})

describe('console:eventmetadata:update', () => {
  let command

  beforeEach(async () => {
    command = new EventmetadataUpdateCommand([])
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

  describe('successfully update event metadata', () => {
    beforeEach(async () => {
      command.initSdk = jest.fn()
      command.eventClient = { updateEventMetadataForProvider: jest.fn().mockReturnValue(mock.data.eventMetadataUpdatedSample) }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should update an event metadata and return response', async () => {
      command.argv = ['providerId', 'com.adobe.CODE01']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL04', description: 'DESC04', docs_url: 'DOCS01' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('eventmetadata/update.txt')
    })

    test('should update an event metadata and return response as json', async () => {
      command.argv = ['providerId', 'com.adobe.CODE01', '--json']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL04', description: 'DESC04', docs_url: 'DOCS01' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(JSON.parse(stdout.output)).toMatchFixtureJson('eventmetadata/update.json')
    })

    test('should update a provider and return response as yaml', async () => {
      command.argv = ['providerId', 'com.adobe.CODE01', '--yml']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL04', description: 'DESC04', docs_url: 'DOCS01' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('eventmetadata/update.yml')
    })
  })

  describe('fail to update event metadata', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { updateEventMetadataForProvider: jest.fn().mockRejectedValue('Error updating event metadata') }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return error on update provider', async () => {
      command.argv = ['providerId', 'com.adobe.CODE01']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL04', description: 'DESC04', docs_url: 'DOCS01' })
      await expect(command.run()).rejects.toThrowError(new Error('Error updating event metadata'))
    })
  })
})
