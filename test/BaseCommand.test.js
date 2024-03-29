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
const { EOL } = require('os')

// mocks setup
jest.mock('@adobe/aio-lib-ims', () => ({
  getToken: jest.fn(),
  context: {
    setCli: jest.fn(),
    get: jest.fn()
  }
}))
const Ims = require('@adobe/aio-lib-ims')

const mockConsoleInstance = { downloadWorkspaceJson: jest.fn() }
jest.mock('@adobe/aio-lib-console', () => ({
  init: jest.fn().mockResolvedValue(mockConsoleInstance)
}))
const Console = require('@adobe/aio-lib-console')

const mockEventsInstance = { fake: 'instance' }
jest.mock('@adobe/aio-lib-events', () => ({
  init: jest.fn().mockResolvedValue(mockEventsInstance)
}))
const Events = require('@adobe/aio-lib-events')

// mocked in __mocks__
const aioConfig = require('@adobe/aio-lib-core-config')

const BaseCommand = require('../src/BaseCommand')

const CONSOLE_CONFIG_KEY = 'console'
const EVENT_CONFIG_KEY = 'events'
const CONSOLE_API_KEY = 'aio-cli-console-auth'
const IMS_CLI_CONFIG_KEY = 'ims'
const TEST_WORKSPACE_NAME = 'Rug'

let command
beforeEach(() => {
  command = new BaseCommand([])
  command.log = jest.fn()

  aioConfig.get.mockReset()
  aioConfig.set.mockReset()

  Ims.context.get.mockReset()
  Ims.context.setCli.mockReset()
  Ims.getToken.mockReset()
  Ims.getToken.mockResolvedValue('bowling')

  Console.init.mockClear()
  mockConsoleInstance.downloadWorkspaceJson.mockReset()

  Events.init.mockClear()
})

describe('interface', () => {
  test('exports', () => {
    expect(typeof BaseCommand).toEqual('function')
  })

  test('flags', async () => {
    expect(BaseCommand.flags.help.type).toBe('boolean')
  })
})

describe('initSDK', () => {
  let _validConfig
  let consoleConfig
  let eventsConfig
  let localConfig
  let localEnvConfig
  beforeEach(() => {
    _validConfig = {
      org: { code: 'A1B23456789DUDE@MoviesOrg', id: '09876', name: 'Coen Brothers' },
      integration: { id: '11111', clientId: '222333444555666', name: 'Project_WhiteRussian' },
      project: { id: '123456789', name: 'TheBigLebowski', title: "the dude's project" },
      workspace: { id: '543216789', name: TEST_WORKSPACE_NAME }
    }
    consoleConfig = { org: _validConfig.org, project: { ..._validConfig.project, org_id: _validConfig.org.id }, workspace: _validConfig.workspace }
    eventsConfig = { integration: _validConfig.integration, workspaceId: _validConfig.workspace.id }
    localConfig = {
      project: {
        name: _validConfig.project.name,
        id: _validConfig.project.id,
        title: _validConfig.project.title,
        org: { id: _validConfig.org.id, name: _validConfig.org.name, ims_org_id: _validConfig.org.code },
        workspace: {
          id: _validConfig.workspace.id,
          name: _validConfig.workspace.name,
          title: `Don't pee on the ${TEST_WORKSPACE_NAME}`,
          details: {
            credentials: [
              { id: 'bad', name: 'not service', integration_type: 'oauth' },
              { id: _validConfig.integration.id, name: _validConfig.integration.name, integration_type: 'service' }
            ]
          }
        }
      }
    }
    localEnvConfig = { [IMS_CLI_CONFIG_KEY]: { contexts: { [_validConfig.integration.name.toLowerCase()]: { client_id: _validConfig.integration.clientId } } } }
  })
  test('not local config, console and events config are set', async () => {
    aioConfig.get.mockImplementation((key, type) => {
      if (type === 'local') return undefined
      if (key === CONSOLE_CONFIG_KEY) return consoleConfig
      if (key === EVENT_CONFIG_KEY) return eventsConfig
    })
    await command.initSdk()
    expect(command.consoleClient).toBe(mockConsoleInstance)
    expect(Console.init).toHaveBeenCalledWith('bowling', CONSOLE_API_KEY)
    expect(command.eventClient).toBe(mockEventsInstance)
    expect(Events.init).toHaveBeenCalledWith(_validConfig.org.code, _validConfig.integration.clientId, 'bowling')
    expect(command.accessToken).toBe('bowling')
    expect(command.conf).toEqual({ ..._validConfig, isLocal: false })
    expect(mockConsoleInstance.downloadWorkspaceJson).toHaveBeenCalledTimes(0)
  })
  test('not local config, console config is set but not events config', async () => {
    aioConfig.get.mockImplementation((key, type) => {
      if (type === 'local') return undefined
      if (key === CONSOLE_CONFIG_KEY) return consoleConfig
      if (key === EVENT_CONFIG_KEY) return undefined
    })
    mockConsoleInstance.downloadWorkspaceJson.mockResolvedValue({
      body: {
        project: {
          workspace: {
            details: {
              credentials: [
                { id: 'bad', name: 'not service', integration_type: 'oauth' },
                {
                  id: _validConfig.integration.id,
                  name: _validConfig.integration.name,
                  integration_type: 'service',
                  jwt: { client_id: _validConfig.integration.clientId }
                }
              ]
            }
          }
        }
      }
    })
    await command.initSdk()
    expect(command.consoleClient).toBe(mockConsoleInstance)
    expect(Console.init).toHaveBeenCalledWith('bowling', CONSOLE_API_KEY)
    expect(command.eventClient).toBe(mockEventsInstance)
    expect(Events.init).toHaveBeenCalledWith(_validConfig.org.code, _validConfig.integration.clientId, 'bowling')
    expect(command.accessToken).toBe('bowling')
    expect(command.conf).toEqual({ ..._validConfig, isLocal: false })
    expect(mockConsoleInstance.downloadWorkspaceJson).toHaveBeenCalledWith(_validConfig.org.id, _validConfig.project.id, _validConfig.workspace.id)
  })

  test('not local config, console config and events is set but not events config does not point to same workspace id', async () => {
    eventsConfig.workspaceId = 'other'
    aioConfig.get.mockImplementation((key, type) => {
      if (type === 'local') return undefined
      if (key === CONSOLE_CONFIG_KEY) return consoleConfig
      if (key === EVENT_CONFIG_KEY) return eventsConfig
    })
    mockConsoleInstance.downloadWorkspaceJson.mockResolvedValue({
      body: {
        project: {
          workspace: {
            details: {
              credentials: [
                { id: 'bad', name: 'not service', integration_type: 'oauth' },
                {
                  id: _validConfig.integration.id,
                  name: _validConfig.integration.name,
                  integration_type: 'service',
                  jwt: { client_id: _validConfig.integration.clientId }
                }
              ]
            }
          }
        }
      }
    })
    await command.initSdk()
    expect(aioConfig.set).toHaveBeenCalledWith(EVENT_CONFIG_KEY, {
      integration: { id: _validConfig.integration.id, name: _validConfig.integration.name, clientId: _validConfig.integration.clientId },
      workspaceId: _validConfig.workspace.id
    }, false)
    expect(command.consoleClient).toBe(mockConsoleInstance)
    expect(Console.init).toHaveBeenCalledWith('bowling', CONSOLE_API_KEY)
    expect(command.eventClient).toBe(mockEventsInstance)
    expect(Events.init).toHaveBeenCalledWith(_validConfig.org.code, _validConfig.integration.clientId, 'bowling')
    expect(command.accessToken).toBe('bowling')
    expect(command.conf).toEqual({ ..._validConfig, isLocal: false })
    expect(mockConsoleInstance.downloadWorkspaceJson).toHaveBeenCalledWith(_validConfig.org.id, _validConfig.project.id, _validConfig.workspace.id)
  })

  test('not local config, console config is set but there is no jwt integration', async () => {
    aioConfig.get.mockImplementation((key, type) => {
      if (type === 'local') return undefined
      if (key === CONSOLE_CONFIG_KEY) return consoleConfig
      if (key === EVENT_CONFIG_KEY) return undefined
    })
    const BAD_WORKSPACE_NAME = 'badDude'
    mockConsoleInstance.downloadWorkspaceJson.mockResolvedValue({
      body: {
        project: {
          workspace: {
            name: BAD_WORKSPACE_NAME,
            details: {
              credentials: [
                { id: 'bad', name: 'not service', integration_type: 'oauth' }
              ]
            }
          }
        }
      }
    })
    await expect(command.initSdk()).rejects.toThrow(command.getErrorMessageForInvalidCredentials(BAD_WORKSPACE_NAME))
  })

  test('not local config, console config is not set', async () => {
    aioConfig.get.mockImplementation((key, type) => {
      if (type === 'local') return undefined
      if (key === CONSOLE_CONFIG_KEY) return undefined
      if (key === EVENT_CONFIG_KEY) return undefined
    })
    await expect(command.initSdk()).rejects.toThrow(
      `Your console configuration is incomplete.${EOL}` +
      `Use the 'aio console' commands to select your organization, project, and workspace.${EOL}` +
      `1. Org: <no org selected>${EOL}` +
      `2. Project: <no project selected>${EOL}` +
      '3. Workspace: <no workspace selected>')
  })

  test('not local config, console config workspace is not set', async () => {
    delete consoleConfig.workspace
    aioConfig.get.mockImplementation((key, type) => {
      if (type === 'local') return undefined
      if (key === CONSOLE_CONFIG_KEY) return consoleConfig
      if (key === EVENT_CONFIG_KEY) return undefined
    })
    await expect(command.initSdk()).rejects.toThrow(
      `Your console configuration is incomplete.${EOL}` +
      `Use the 'aio console' commands to select your organization, project, and workspace.${EOL}` +
      `1. Org: Coen Brothers${EOL}` +
      `2. Project: TheBigLebowski${EOL}` +
      '3. Workspace: <no workspace selected>')
  })

  test('not local config, console config workspace and project is not set', async () => {
    delete consoleConfig.workspace
    delete consoleConfig.project
    aioConfig.get.mockImplementation((key, type) => {
      if (type === 'local') return undefined
      if (key === CONSOLE_CONFIG_KEY) return consoleConfig
      if (key === EVENT_CONFIG_KEY) return undefined
    })
    await expect(command.initSdk()).rejects.toThrow(
      `Your console configuration is incomplete.${EOL}` +
      `Use the 'aio console' commands to select your organization, project, and workspace.${EOL}` +
      `1. Org: Coen Brothers${EOL}` +
      `2. Project: <no project selected>${EOL}` +
      '3. Workspace: <no workspace selected>')
  })

  test('local app config, .aio and env are set', async () => {
    aioConfig.get.mockImplementation((key, type) => {
      if (type === 'local' && key === 'project') return localConfig.project
    })
    Ims.context.get.mockReturnValue({ data: Object.values(localEnvConfig[IMS_CLI_CONFIG_KEY].contexts)[0] })
    await command.initSdk()
    expect(command.consoleClient).toBe(mockConsoleInstance)
    expect(Console.init).toHaveBeenCalledWith('bowling', CONSOLE_API_KEY)
    expect(command.eventClient).toBe(mockEventsInstance)
    expect(Events.init).toHaveBeenCalledWith(_validConfig.org.code, _validConfig.integration.clientId, 'bowling')
    expect(command.accessToken).toBe('bowling')
    expect(command.conf).toEqual({ ..._validConfig, isLocal: true })
    expect(Ims.context.get).toHaveBeenCalledWith(_validConfig.integration.name)
  })

  test('local app config, missing jwt integration', async () => {
    localConfig.project.workspace.details.credentials.pop()
    aioConfig.get.mockImplementation((key, type) => {
      if (type === 'local' && key === 'project') return localConfig.project
      if (type === 'env' && key === `${IMS_CLI_CONFIG_KEY}.contexts.${_validConfig.integration.name}`) return Object.values(localEnvConfig[IMS_CLI_CONFIG_KEY])[0]
    })
    await expect(command.initSdk()).rejects.toThrow(command.getErrorMessageForInvalidCredentials(TEST_WORKSPACE_NAME))
  })

  test('local app config, missing .env credentials jwt client id', async () => {
    aioConfig.get.mockImplementation((key, type) => {
      if (type === 'local' && key === 'project') return localConfig.project
    })
    Ims.context.get.mockReturnValue({ data: { clientId: 'is not client_id', other: 'fake data' } })
    await expect(command.initSdk()).rejects.toThrow('IMS configuration for Project_WhiteRussian is incomplete or missing')
    expect(Ims.context.get).toHaveBeenCalledWith(_validConfig.integration.name)
  })

  test('local app config, missing .env', async () => {
    aioConfig.get.mockImplementation((key, type) => {
      if (type === 'local' && key === 'project') return localConfig.project
    })
    Ims.context.get.mockReturnValue({ data: undefined })
    await expect(command.initSdk()).rejects.toThrow('IMS configuration for Project_WhiteRussian is incomplete or missing')
    expect(Ims.context.get).toHaveBeenCalledWith(_validConfig.integration.name)
  })
})
