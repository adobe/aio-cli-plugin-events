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
const mock = require('../mocks')

jest.mock('@adobe/aio-lib-events')
const eventsSdk = require('@adobe/aio-lib-events')
const mockEventsSdkInstance = {
  getAllRegistrationsForWorkspace: jest.fn(),
  deleteRegistration: jest.fn()
}
jest.mock('@adobe/aio-lib-ims')
const { getToken } = require('@adobe/aio-lib-ims')

jest.mock('@adobe/aio-lib-ims/src/context')
const CONSUMER_ID = '112233'
const PROJECT_ID = 'projectId'
const WORKSPACE_ID = 'workspaceId'

describe('pre undeploy event registration hook interfaces', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    eventsSdk.init.mockResolvedValue(mockEventsSdkInstance)
  })

  afterEach(() => {
    eventsSdk.init.mockRestore()
  })

  test('hook interface', async () => {
    const hook = require('../../src/hooks/pre-undeploy-event-reg')
    expect(typeof hook).toBe('function')
  })

  test('no project error', async () => {
    const hook = require('../../src/hooks/pre-undeploy-event-reg')
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: {} })).rejects.toThrowError(new Error('No project found, skipping event registration in pre-undeploy-event-reg hook'))
  })

  test('no events should return without error', async () => {
    const hook = require('../../src/hooks/pre-undeploy-event-reg')
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: { project: mock.data.sampleProject } })).resolves.not.toThrowError()
  })

  test('no service api key error', async () => {
    const hook = require('../../src/hooks/pre-undeploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingApiKey
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrowError(new Error('Required SERVICE_API_KEY is missing from .env file'))
  })

  test('events sdk not initialised correctly error', async () => {
    const hook = require('../../src/hooks/pre-undeploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingProviderMetadataToProviderIdMapping
    getToken.mockReturnValue('accessToken')
    eventsSdk.init.mockResolvedValue(undefined)
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrowError(new Error('Events SDK could not be initialised correctly. Skipping event registration in pre-undeploy-event-reg hook'))
  })

  test('no event registrations in workspace to return without error', async () => {
    const hook = require('../../src/hooks/pre-undeploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingProviderMetadataToProviderIdMapping
    mockEventsSdkInstance.getAllRegistrationsForWorkspace.mockResolvedValue(mock.data.getAllWebhookRegistrationsWithEmptyResponse)
    getToken.mockReturnValue('accessToken')
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).resolves.not.toThrowError()
    expect(mockEventsSdkInstance.deleteRegistration).toBeCalledTimes(0)
  })

  test('error in delete registration', async () => {
    const hook = require('../../src/hooks/pre-undeploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    mockEventsSdkInstance.getAllRegistrationsForWorkspace.mockResolvedValue(mock.data.getAllWebhookRegistrationsResponse)

    mockEventsSdkInstance.deleteRegistration.mockRejectedValueOnce(JSON.stringify({
      code: 500,
      errorDetails: {
        message: 'Internal Server Error'
      }
    }))
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrowError()
    expect(mockEventsSdkInstance.deleteRegistration).toBeCalledTimes(1)
    expect(mockEventsSdkInstance.deleteRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID, 'REGID1')
  })

  test('successfully create registration', async () => {
    const hook = require('../../src/hooks/pre-undeploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    mockEventsSdkInstance.getAllRegistrationsForWorkspace.mockResolvedValue(mock.data.getAllWebhookRegistrationsResponse)

    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).resolves.not.toThrowError()
    expect(mockEventsSdkInstance.deleteRegistration).toBeCalledTimes(2)
  })
})
