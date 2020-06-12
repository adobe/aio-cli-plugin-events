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
const EventmetadataListCommand = require('../../../../src/commands/event/eventmetadata/list')

test('exports', async () => {
  expect(typeof EventmetadataListCommand).toEqual('function')
  expect(EventmetadataListCommand.prototype instanceof Command).toBeTruthy()
})

test('description', async () => {
  expect(EventmetadataListCommand.description).toBeDefined()
})

test('flags', async () => {
  expect(EventmetadataListCommand.flags.help.type).toBe('boolean')
  expect(EventmetadataListCommand.flags.version.type).toBe('boolean')
  expect(EventmetadataListCommand.flags.verbose.type).toBe('boolean')
  expect(EventmetadataListCommand.flags.json.char).toBe('j')
  expect(EventmetadataListCommand.flags.json.exclusive).toEqual(['yml'])
  expect(EventmetadataListCommand.flags.yml.type).toBe('boolean')
  expect(EventmetadataListCommand.flags.yml.char).toBe('y')
  expect(EventmetadataListCommand.flags.yml.exclusive).toEqual(['json'])
})
test('args', async () => {
  expect(EventmetadataListCommand.args[0].required).toBe(true)
  expect(EventmetadataListCommand.args[0].description).toBeDefined()
})

describe('console:eventmetadata:list', () => {
  let command

  beforeEach(async () => {
    command = new EventmetadataListCommand([])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('exists', async () => {
    expect(command.run).toBeInstanceOf(Function)
  })

  describe('successfully list event metadata', () => {
    beforeEach(async () => {
      command.initSdk = jest.fn()
      command.eventClient = { getAllEventMetadataForProvider: jest.fn().mockReturnValue(mock.data.getAllEventMetadata) }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return list of event metadata', async () => {
      command.argv = ['providerId']
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('eventmetadata/list.txt')
    })

    test('should return list of event metadata as json', async () => {
      command.argv = ['providerId', '--json']
      await expect(command.run()).resolves.not.toThrowError()
      expect(JSON.parse(stdout.output)).toMatchFixtureJson('eventmetadata/list.json')
    })

    test('should return list of event metadata as yaml', async () => {
      command.argv = ['providerId', '--yml']
      await expect(command.run()).resolves.not.toThrowError()
      expect(stdout.output).toMatchFixture('eventmetadata/list.yml')
    })
  })

  describe('fail to fetch list of event metadatas', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { getAllEventMetadataForProvider: jest.fn().mockRejectedValue('Error retrieving event metadata') }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return error on get list of event metadata', async () => {
      command.argv = ['providerId']
      await expect(command.run()).rejects.toThrowError(new Error('Error retrieving event metadata'))
    })
  })
})
