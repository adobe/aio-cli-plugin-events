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
  createRegistration: jest.fn(),
  updateRegistration: jest.fn(),
  getAllRegistrationsForWorkspace: jest.fn(),
  deleteRegistration: jest.fn()
}
jest.mock('@adobe/aio-lib-ims')
const { getToken } = require('@adobe/aio-lib-ims')

jest.mock('@adobe/aio-lib-ims/src/context')
const CONSUMER_ID = '112233'
const PROJECT_ID = 'projectId'
const WORKSPACE_ID = 'workspaceId'

describe('post deploy event registration hook interfaces', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    eventsSdk.init.mockResolvedValue(mockEventsSdkInstance)
  })

  afterEach(() => {
    eventsSdk.init.mockRestore()
  })

  test('hook interface', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
  })

  test('no project should return without error', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: {} })).resolves.not.toThrow()
  })

  test('no events should return without error', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: { project: mock.data.sampleProject } })).resolves.not.toThrow()
  })

  test('no service api key error', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingApiKey
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrow(new Error('Required SERVICE_API_KEY is missing from .env file'))
  })

  test('events sdk not initialised correctly error', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingProviderMetadataToProviderIdMapping
    getToken.mockReturnValue('accessToken')
    eventsSdk.init.mockResolvedValue(undefined)
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrow(new Error('Events SDK could not be initialised correctly. Skipping event registration in post-deploy-event-reg hook'))
  })

  test('no providerMetadata to providerId mapping env variable error', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingProviderMetadataToProviderIdMapping
    getToken.mockReturnValue('accessToken')
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrow(new Error('No environment variables for provider metadata to provider id mappings found.'))
  })

  test('empty providerMetadata to providerId mapping env variable error', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingProviderMetadataToProviderIdMapping
    process.env.AIO_events_providermetadata_to_provider_mapping = ''
    getToken.mockReturnValue('accessToken')
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrow(new Error('No environment variables for provider metadata to provider id mappings found.'))
  })

  test('providerMetadata to providerId missing for some providers', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingProviderMetadataToProviderIdMapping
    process.env.AIO_events_providermetadata_to_provider_mapping = ''
    process.env = {
      ...mock.data.dotEnvMissingProviderMetadataToProviderIdMapping,
      AIO_EVENTS_PROVIDERMETADATA_TO_PROVIDER_MAPPING: 'providerMetadata2:providerId2'
    }
    getToken.mockReturnValue('accessToken')
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrow(new Error('No provider id mapping found for provider metadata providerMetadata1. Skipping event registration'))
  })

  test('error in create registration', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    mockEventsSdkInstance.createRegistration.mockRejectedValueOnce(JSON.stringify({
      code: 500,
      errorDetails: {
        message: 'Internal Server Error'
      }
    }))
    await expect(hook({ appConfig: { project: mock.data.sampleProjectWithoutEvents, events: mock.data.sampleEvents } })).rejects.toThrow()
    expect(mockEventsSdkInstance.createRegistration).toHaveBeenCalledTimes(1)
    expect(mockEventsSdkInstance.createRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID,
      mock.data.hookDecodedEventRegistration1
    )
  })

  test('successfully create registration', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    mockEventsSdkInstance.createRegistration.mockReturnValue(mock.data.createWebhookRegistrationResponse)
    await expect(hook({ appConfig: { project: mock.data.sampleProjectWithoutEvents, events: mock.data.sampleEventsWithWebhookAndJournalReg } })).resolves.not.toThrow()
    expect(mockEventsSdkInstance.createRegistration).toHaveBeenCalledTimes(1)
    expect(mockEventsSdkInstance.createRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID,
      mock.data.hookDecodedEventRegistration1
    )
  })

  test('successfully create registration with delivery type defined', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    const events = mock.data.sampleEventsWithWebhookAndJournalReg
    events.registrations['Event Registration 1'].delivery_type = 'webhook'
    mockEventsSdkInstance.getAllRegistrationsForWorkspace.mockResolvedValue(mock.data.getAllWebhookRegistrationsWithEmptyResponse)
    mockEventsSdkInstance.createRegistration.mockReturnValue(mock.data.createWebhookRegistrationResponse)
    const projectWithEmptyEvents = mock.data.sampleProjectWithoutEvents
    projectWithEmptyEvents.workspace.details.events = {}
    await expect(hook({ appConfig: { project: projectWithEmptyEvents, events } })).resolves.not.toThrow()
    expect(mockEventsSdkInstance.createRegistration).toHaveBeenCalledTimes(1)
    expect(mockEventsSdkInstance.createRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID,
      mock.data.hookDecodedEventRegistration1
    )
  })

  test('error in update registration', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    mockEventsSdkInstance.getAllRegistrationsForWorkspace.mockResolvedValue(mock.data.getAllWebhookRegistrationsResponse)
    mockEventsSdkInstance.updateRegistration.mockRejectedValueOnce(JSON.stringify({
      code: 500,
      errorDetails: {
        message: 'Internal Server Error'
      }
    }))
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrow()
    expect(mockEventsSdkInstance.updateRegistration).toHaveBeenCalledTimes(1)
    expect(mockEventsSdkInstance.updateRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID, 'REGID1',
      mock.data.hookDecodedEventRegistration1
    )
  })

  test('successfully update registration', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    mockEventsSdkInstance.getAllRegistrationsForWorkspace.mockResolvedValue(mock.data.getAllWebhookRegistrationsResponse)
    mockEventsSdkInstance.updateRegistration.mockReturnValue(mock.data.createWebhookRegistrationResponse)
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEventsWithWebhookAndJournalReg } })).resolves.not.toThrow()
    expect(mockEventsSdkInstance.updateRegistration).toHaveBeenCalledTimes(1)
    expect(mockEventsSdkInstance.updateRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID, 'REGID1',
      mock.data.hookDecodedEventRegistration1
    )
  })

  test('successfully delete registrations not part of the config', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    const events = {
      registrations: {
        'Event Registration 1': mock.data.sampleEvents.registrations['Event Registration 1']
      }
    }
    mockEventsSdkInstance.getAllRegistrationsForWorkspace.mockResolvedValue(mock.data.getAllWebhookRegistrationsResponse)
    mockEventsSdkInstance.updateRegistration.mockReturnValue(mock.data.createWebhookRegistrationResponse)
    const projectWithEmptyEvents = mock.data.sampleProjectWithoutEvents
    await expect(hook({ appConfig: { project: projectWithEmptyEvents, events }, force: true })).resolves.not.toThrow()
    expect(mockEventsSdkInstance.updateRegistration).toHaveBeenCalledTimes(1)
    expect(mockEventsSdkInstance.deleteRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID, 'REGID2')
  })

  test('delete registrations not part of the config, with no registrations to delete', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    mockEventsSdkInstance.getAllRegistrationsForWorkspace.mockResolvedValue(mock.data.getAllWebhookRegistrationsResponse)
    mockEventsSdkInstance.updateRegistration.mockReturnValue(mock.data.createWebhookRegistrationResponse)
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEventsWithWebhookAndJournalReg }, force: true })).resolves.not.toThrow()
    expect(mockEventsSdkInstance.updateRegistration).toHaveBeenCalledTimes(1)
    expect(mockEventsSdkInstance.updateRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID, 'REGID1',
      mock.data.hookDecodedEventRegistration1)
    expect(mockEventsSdkInstance.deleteRegistration).toHaveBeenCalledTimes(0)
  })

  test('delete registrations not part of the config, with no registrations in workspace', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    mockEventsSdkInstance.getAllRegistrationsForWorkspace.mockResolvedValue(mock.data.getAllWebhookRegistrationsWithEmptyResponse)

    mockEventsSdkInstance.createRegistration.mockReturnValue(mock.data.createWebhookRegistrationResponse)
    await expect(hook({ appConfig: { project: mock.data.sampleProjectWithoutEvents, events: mock.data.sampleEventsWithWebhookAndJournalReg }, force: true })).resolves.not.toThrow()
    expect(mockEventsSdkInstance.createRegistration).toHaveBeenCalledTimes(1)
    expect(mockEventsSdkInstance.createRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID,
      mock.data.hookDecodedEventRegistration1)
    expect(mockEventsSdkInstance.deleteRegistration).toHaveBeenCalledTimes(0)
  })

  test('error on delete registrations not part of the config', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    const events = {
      registrations: {
        'Event Registration 1': mock.data.sampleEvents.registrations['Event Registration 1']
      }
    }
    mockEventsSdkInstance.getAllRegistrationsForWorkspace.mockResolvedValue(mock.data.getAllWebhookRegistrationsResponse)
    mockEventsSdkInstance.updateRegistration.mockReturnValue(mock.data.createWebhookRegistrationResponse)
    mockEventsSdkInstance.deleteRegistration.mockRejectedValueOnce({
      code: 500,
      errorDetails: {
        message: 'Internal Server Error'
      }
    })
    const projectWithEmptyEvents = mock.data.sampleProjectWithoutEvents
    await expect(hook({ appConfig: { project: projectWithEmptyEvents, events }, force: true })).rejects.toThrow()
    expect(mockEventsSdkInstance.updateRegistration).toHaveBeenCalledTimes(1)
    expect(mockEventsSdkInstance.deleteRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID, 'REGID2')
  })
})
