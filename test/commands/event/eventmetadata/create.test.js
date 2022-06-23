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
const EventmetadataCreateCommand = require('../../../../src/commands/event/eventmetadata/create')

test('exports', async () => {
  expect(typeof EventmetadataCreateCommand).toEqual('function')
  expect(EventmetadataCreateCommand.prototype instanceof Command).toBeTruthy()
})

test('description', async () => {
  expect(EventmetadataCreateCommand.description).toBeDefined()
})

test('flags', async () => {
  expect(EventmetadataCreateCommand.flags.help.type).toBe('boolean')
  expect(EventmetadataCreateCommand.flags.version.type).toBe('boolean')
  expect(EventmetadataCreateCommand.flags.verbose.type).toBe('boolean')
  expect(EventmetadataCreateCommand.flags.json.char).toBe('j')
  expect(EventmetadataCreateCommand.flags.json.exclusive).toEqual(['yml'])
  expect(EventmetadataCreateCommand.flags.yml.type).toBe('boolean')
  expect(EventmetadataCreateCommand.flags.yml.char).toBe('y')
  expect(EventmetadataCreateCommand.flags.yml.exclusive).toEqual(['json'])
})

test('args', async () => {
  expect(EventmetadataCreateCommand.args[0].required).toBe(true)
  expect(EventmetadataCreateCommand.args[0].description).toBeDefined()
})

describe('console:eventmetadata:create', () => {
  let command

  beforeEach(async () => {
    command = new EventmetadataCreateCommand([])
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

  describe('successfully create event metadata', () => {
    beforeEach(async () => {
      command.initSdk = jest.fn()
      command.eventClient = { createEventMetadataForProvider: jest.fn().mockReturnValue(mock.data.eventMetadataSample) }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should create an event metadata and return response', async () => {
      command.argv = ['providerId']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL01', description: 'DESC01', event_code: 'come.adobe.CODE01' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('eventmetadata/create.txt')
    })

    test('should create an event metadata and return response as json', async () => {
      command.argv = ['providerId', '--json']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL01', description: 'DESC01', event_code: 'come.adobe.CODE01' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(JSON.parse(stdout.output)).toMatchFixtureJson('eventmetadata/create.json')
    })

    test('should create an event metadata and return response as yaml', async () => {
      command.argv = ['providerId', '--yml']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL01', description: 'DESC01', event_code: 'come.adobe.CODE01' })
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('eventmetadata/create.yml')
    })
  })

  describe('fail to create event metadata', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { createEventMetadataForProvider: jest.fn().mockRejectedValue('Error creating event metadata') }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return error on create event metadata', async () => {
      command.argv = ['providerId']
      inquirer.prompt.mockResolvedValueOnce({ label: 'LABEL01', description: 'DESC01', event_code: 'come.adobe.CODE01' })
      await expect(command.run()).rejects.toThrowError(new Error('Error creating event metadata'))
    })
  })
})
