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

  test('no service api key error', async () => {
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingApiKey
    await expect(hook({ appConfig: { all: { application: { events: mock.data.sampleEvents, project: mock.data.sampleProject } } } })).rejects.toThrow(new Error('Required SERVICE_API_KEY is missing from .env file'))
  })

  test('valid events should return without error', async () => {
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    mockFetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue('OK') })
    await expect(hook({ appConfig: { all: { application: { events: mock.data.sampleEvents, project: mock.data.sampleProject } } } })).resolves.not.toThrow()
  })

  test('invalid events should return error', async () => {
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    mockFetch.mockResolvedValue({ ok: false, json: jest.fn().mockResolvedValue('Bad Request') })
    await expect(hook({ appConfig: { all: { application: { events: mock.data.sampleEvents, project: mock.data.sampleProject } } } })).rejects.toThrow(new Error('Error: "Bad Request"'))
  })

  test('error in fetching from URL should throw error', async () => {
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    mockFetch.mockRejectedValue(new Error('Connection Rejected'))
    await expect(hook({ appConfig: { all: { application: { events: mock.data.sampleEvents, project: mock.data.sampleProject } } } })).rejects.toThrow(new Error('Error: Connection Rejected'))
  })
})
