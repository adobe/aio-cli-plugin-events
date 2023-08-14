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
const ProviderListCommand = require('../../../../src/commands/event/provider/list')

const ORG_ID = 'ORGID'

test('exports', async () => {
  expect(typeof ProviderListCommand).toEqual('function')
  expect(ProviderListCommand.prototype instanceof Command).toBeTruthy()
})

test('description', async () => {
  expect(ProviderListCommand.description).toBeDefined()
})

test('flags', async () => {
  expect(ProviderListCommand.flags.help.type).toBe('boolean')
  expect(ProviderListCommand.flags.version.type).toBe('boolean')
  expect(ProviderListCommand.flags.verbose.type).toBe('boolean')
  expect(ProviderListCommand.flags.json.char).toBe('j')
  expect(ProviderListCommand.flags.json.exclusive).toEqual(['yml'])
  expect(ProviderListCommand.flags.yml.type).toBe('boolean')
  expect(ProviderListCommand.flags.yml.char).toBe('y')
  expect(ProviderListCommand.flags.yml.exclusive).toEqual(['json'])
})

test('args', async () => {
  expect(ProviderListCommand.args).toBeUndefined()
})

describe('console:provider:list', () => {
  let command

  beforeEach(async () => {
    command = new ProviderListCommand([])
    command.conf = {
      org: {
        id: ORG_ID
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('exists', async () => {
    expect(command.run).toBeInstanceOf(Function)
  })

  describe('successfully list providers', () => {
    beforeEach(async () => {
      command.initSdk = jest.fn()
      command.eventClient = { getAllProviders: jest.fn().mockReturnValue(mock.data.getAllProvidersResponse) }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return list of providers', async () => {
      await expect(command.run()).resolves.not.toThrow()
      expect(stdout.output).toMatchFixture('provider/list.txt')
    })

    test('should return list of providers as json', async () => {
      command.argv = ['--json']
      await expect(command.run()).resolves.not.toThrow()
      expect(JSON.parse(stdout.output)).toMatchFixtureJson('provider/list.json')
    })

    test('should return list of providers as yaml', async () => {
      command.argv = ['--yml']
      await expect(command.run()).resolves.not.toThrow()
      expect(stdout.output).toMatchFixture('provider/list.yml')
    })

    test('should return list of providers with event metadata', async () => {
      command.argv = ['--fetchEventMetadata']
      await expect(command.run()).resolves.not.toThrow()
      expect(command.eventClient.getAllProviders).toHaveBeenCalledWith(ORG_ID, {
        fetchEventMetadata: true,
        filterBy: {
          instanceId: undefined,
          providerMetadataId: undefined,
          providerMetadataIds: undefined
        }
      })
    })

    test('should return providers for provider metadata id and instance id', async () => {
      command.argv = ['--providerMetadataId', 'pm-1', '--instanceId', 'instance1']
      await expect(command.run()).resolves.not.toThrow()
      expect(command.eventClient.getAllProviders).toHaveBeenCalledWith(ORG_ID, {
        fetchEventMetadata: undefined,
        filterBy: {
          instanceId: 'instance1',
          providerMetadataId: 'pm-1',
          providerMetadataIds: undefined
        }
      })
    })

    test('should return list of providers for provider metadata id list', async () => {
      command.argv = ['--providerMetadataIds', 'pm-1', 'pm-2']
      await expect(command.run()).resolves.not.toThrow()
      expect(command.eventClient.getAllProviders).toHaveBeenCalledWith(ORG_ID, {
        fetchEventMetadata: undefined,
        filterBy: {
          instanceId: undefined,
          providerMetadataId: undefined,
          providerMetadataIds: ['pm-1', 'pm-2']
        }
      })
    })
  })

  describe('fail to fetch list of providers', () => {
    beforeEach(() => {
      command.initSdk = jest.fn()
      jest.fn().mockResolvedValue(command.eventClient)
      command.eventClient = { getAllProviders: jest.fn().mockRejectedValue('Error retrieving providers') }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should return error on get list of providers', async () => {
      await expect(command.run()).rejects.toThrow(new Error('Error retrieving providers'))
    })

    test('should return error on passing both providerMetadataId and providerMetadataIds flags', async () => {
      command.argv = ['--providerMetadataId', 'pm-1', '--providerMetadataIds', 'pm-1', 'pm-2']
      await expect(command.run()).rejects.toThrow('--providerMetadataId=pm-1 cannot also be provided when using --providerMetadataIds')
    })
  })
})
