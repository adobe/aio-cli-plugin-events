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
const EventmetadataGetCommand = require('../../../../src/commands/event/eventmetadata/get')

test('exports', async () => {
  expect(typeof EventmetadataGetCommand).toEqual('function')
  expect(EventmetadataGetCommand.prototype instanceof Command).toBeTruthy()
})

test('description', async () => {
  expect(EventmetadataGetCommand.description).toBeDefined()
})

test('flags', async () => {
  expect(EventmetadataGetCommand.flags.help.type).toBe('boolean')
  expect(EventmetadataGetCommand.flags.version.type).toBe('boolean')
  expect(EventmetadataGetCommand.flags.verbose.type).toBe('boolean')
  expect(EventmetadataGetCommand.flags.json.char).toBe('j')
  expect(EventmetadataGetCommand.flags.json.exclusive).toEqual(['yml'])
  expect(EventmetadataGetCommand.flags.yml.type).toBe('boolean')
  expect(EventmetadataGetCommand.flags.yml.char).toBe('y')
  expect(EventmetadataGetCommand.flags.yml.exclusive).toEqual(['json'])
})

test('args', async () => {
  expect(EventmetadataGetCommand.args[0].required).toBe(true)
  expect(EventmetadataGetCommand.args[0].description).toBeDefined()
  expect(EventmetadataGetCommand.args[1].required).toBe(true)
  expect(EventmetadataGetCommand.args[1].description).toBeDefined()
})

describe('console:eventmetadata:get', () => {
  let command

  beforeEach(async () => {
    command = new EventmetadataGetCommand([])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('exists', async () => {
    expect(command.run).toBeInstanceOf(Function)
  })

  describe('successfully get event metadata', () => {
    beforeEach(async () => {
      command.initSdk = jest.fn()
      command.argv = ['providerId', 'com.adobe.CODE01']
      command.eventClient = { getEventMetadataForProvider: jest.fn().mockReturnValue(mock.data.eventMetadataSample) }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return am event metadata', async () => {
      await expect(command.run()).resolves.not.toThrow()
      expect(stdout.output).toMatchFixture('eventmetadata/get.txt')
    })

    test('should return event metadata as json', async () => {
      command.argv = ['providerId', 'com.adobe.CODE01', '--json']
      await expect(command.run()).resolves.not.toThrow()
      expect(JSON.parse(stdout.output)).toMatchFixtureJson('eventmetadata/get.json')
    })

    test('should return event metadata as yaml', async () => {
      command.argv = ['providerId', 'com.adobe.CODE01', '--yml']
      await expect(command.run()).resolves.not.toThrow()
      expect(stdout.output).toMatchFixture('eventmetadata/get.yml')
    })
  })

  describe('fail to fetch event metadata', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { getEventMetadataForProvider: jest.fn().mockRejectedValue('Error retrieving event metadata') }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return error on get event metadata', async () => {
      command.argv = ['providerId', 'com.adobe.CODE01']
      await expect(command.run()).rejects.toThrow(new Error('Error retrieving event metadata'))
    })
  })
})
