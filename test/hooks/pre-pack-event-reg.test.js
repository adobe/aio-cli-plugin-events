/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

jest.mock('@adobe/aio-lib-ims')
jest.mock('@adobe/aio-lib-ims/src/context')

const { getToken } = require('@adobe/aio-lib-ims')

const mockFetch = jest.fn()
jest.mock('@adobe/aio-lib-core-networking', () => ({
  createFetch: jest.fn(() => mockFetch)
}))

const hook = require('../../src/hooks/pre-pack-event-reg')
const mock = require('../mocks')

describe('post deploy event registration hook interfaces', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getToken.mockReturnValue('accessToken')
    mockFetch.mockReset()
  })

  test('hook interface', async () => {
    expect(typeof hook).toBe('function')
  })

  test('no project error', async () => {
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: { all: { application: { events: {} } } } })).rejects.toThrow(new Error('No project found, error in pre-pack events validation hook'))
  })

  test('no events should return without error', async () => {
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: { all: { application: { project: mock.data.sampleProject } } } })).resolves.not.toThrow()
  })

  test('no event registrations should return without error', async () => {
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    await expect(hook({ appConfig: { all: { application: { project: mock.data.sampleProject, events: { registrations: {} }, manifest: mock.data.sampleRuntimeManifest } } } })).resolves.not.toThrow()
  })

  test('no service api key error', async () => {
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingApiKey
    await expect(hook({ appConfig: { all: { application: { events: mock.data.sampleEvents, project: mock.data.sampleProject, manifest: mock.data.sampleRuntimeManifest } } } })).rejects.toThrow(new Error('Required SERVICE_API_KEY is missing from .env file'))
  })

  test('valid events should return without error', async () => {
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    mockFetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue('OK') })
    await expect(hook({ appConfig: { all: { application: { events: mock.data.sampleEvents, project: mock.data.sampleProject, manifest: mock.data.sampleRuntimeManifest } } } })).resolves.not.toThrow()
  })

  test('invalid events should return error', async () => {
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    mockFetch.mockResolvedValue({ ok: false, json: jest.fn().mockResolvedValue('Bad Request') })
    await expect(hook({ appConfig: { all: { application: { events: mock.data.sampleEvents, project: mock.data.sampleProject, manifest: mock.data.sampleRuntimeManifest } } } })).rejects.toThrow(new Error('Error: "Bad Request"'))
  })

  test('error in fetching from URL should throw error', async () => {
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    mockFetch.mockRejectedValue(new Error('Connection Rejected'))
    await expect(hook({ appConfig: { all: { application: { events: mock.data.sampleEvents, project: mock.data.sampleProject, manifest: mock.data.sampleRuntimeManifest } } } })).rejects.toThrow(new Error('Error: Connection Rejected'))
  })

  test('no runtime action in event registration should throw error', async () => {
    expect(typeof hook).toBe('function')
    await expect(hook({
      appConfig: {
        all: {
          application: {
            events: mock.data.sampleEventsWithoutRuntimeAction,
            project: mock.data.sampleProject
          }
        }
      }
    })).rejects.toThrow(new Error('Invalid event registration. All Event registrations need to be associated with a runtime action'))
  })

  test('no runtime manifest should throw error', async () => {
    expect(typeof hook).toBe('function')
    await expect(hook({
      appConfig: {
        all: {
          application: {
            events: mock.data.sampleEvents,
            project: mock.data.sampleProject
          }
        }
      }
    })).rejects.toThrow(new Error('Runtime manifest does not contain package:\n' +
        '        package-1 associated with package-1/poc-event-1\n' +
        '        defined in event registrations'))
  })

  test('no package name in runtime_action should throw error', async () => {
    expect(typeof hook).toBe('function')
    const eventsWithInvalidRuntimeAction = mock.data.sampleEvents
    eventsWithInvalidRuntimeAction.registrations['Event Registration 1'].runtime_action = 'test-action'
    await expect(hook({
      appConfig: {
        all: {
          application: {
            events: eventsWithInvalidRuntimeAction,
            project: mock.data.sampleProject,
            manifest: mock.data.sampleRuntimeManifest
          }
        }
      }
    })).rejects.toThrow(new Error('Runtime action test-action is not correctly defined as part of a package'))
    eventsWithInvalidRuntimeAction.registrations['Event Registration 1'].runtime_action = 'package-1/poc-event-1'
  })

  test('valid package with no actions should not throw an error', async () => {
    expect(typeof hook).toBe('function')
    const runtimeManifestWithOnePackageHavingNoActions = mock.data.sampleRuntimeManifest
    runtimeManifestWithOnePackageHavingNoActions.full.packages['package-3'] = {}
    process.env = mock.data.dotEnv
    mockFetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue('OK') })

    await expect(hook({
      appConfig: {
        all: {
          application: {
            events: mock.data.sampleEvents,
            project: mock.data.sampleProject,
            manifest: runtimeManifestWithOnePackageHavingNoActions
          }
        }
      }
    })).resolves.not.toThrow()
  })

  test('invalid runtime_action name should throw error', async () => {
    expect(typeof hook).toBe('function')
    const eventsWithInvalidRuntimeAction = mock.data.sampleEvents
    eventsWithInvalidRuntimeAction.registrations['Event Registration 1'].runtime_action = 'package-1/invalid-test-action'
    await expect(hook({
      appConfig: {
        all: {
          application: {
            events: eventsWithInvalidRuntimeAction,
            project: mock.data.sampleProject,
            manifest: mock.data.sampleRuntimeManifest
          }
        }
      }
    })).rejects.toThrow(new Error('Runtime action package-1/invalid-test-action associated with the event registration\n' +
        '        does not exist in the runtime manifest'))
  })

  test('web runtime_action should throw error', async () => {
    expect(typeof hook).toBe('function')
    const eventsWithInvalidRuntimeAction = mock.data.sampleEvents
    eventsWithInvalidRuntimeAction.registrations['Event Registration 1'].runtime_action = 'package-2/publish-events'
    await expect(hook({
      appConfig: {
        all: {
          application: {
            events: eventsWithInvalidRuntimeAction,
            project: mock.data.sampleProject,
            manifest: mock.data.sampleRuntimeManifest
          }
        }
      }
    })).rejects.toThrow(new Error('Invalid runtime action package-2/publish-events.\n' +
            '        Only non-web action can be registered for events'))
  })
})
