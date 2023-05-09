const mock = require('../mocks')

jest.mock('@adobe/aio-lib-events')
const eventsSdk = require('@adobe/aio-lib-events')
const mockEventsSdkInstance = {
  createRegistration: jest.fn(),
  updateRegistration: jest.fn()
}
jest.mock('@adobe/aio-lib-ims')
const { getToken } = require('@adobe/aio-lib-ims')

const process = require('process')

jest.mock('@adobe/aio-lib-ims/src/context')
const CONSUMER_ID = '112233'
const PROJECT_ID = 'projectId'
const WORKSPACE_ID = 'workspaceId'

describe('post deploy event registration hook interfaces', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    eventsSdk.init.mockResolvedValue(mockEventsSdkInstance)
  })

  test('hook interface', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
  })

  test('command-error', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: {} })).rejects.toThrowError(new Error('No project found, skipping event registration in post-deploy-hook hook'))
  })

  test('no project error', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: {} })).rejects.toThrowError(new Error('No project found, skipping event registration in post-deploy-hook hook'))
  })

  test('no events should return without error', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: { project: mock.data.sampleProject } })).resolves.not.toThrowError()
  })

  test('no service api key error', async () => {
    const hook = require('../../src/hooks/pre-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingApiKey
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrowError(new Error('Required SERVICE_API_KEY is missing from .env file'))
  })

  test('events sdk not initialised correctly error', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingProviderMetadataToProviderIdMapping
    getToken.mockReturnValue('accessToken')
    eventsSdk.init.mockResolvedValue(undefined)
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrowError(new Error('Events SDK could not be initialised correctly. Skipping event registration in post-deploy-hook hook'))
  })

  test('no providerMetadata to providerId mapping env variable error', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingProviderMetadataToProviderIdMapping
    getToken.mockReturnValue('accessToken')
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrowError(new Error('No environment variables for provider metadata to provider id mappings found.'))
  })

  test('empty providerMetadata to providerId mapping env variable error', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnvMissingProviderMetadataToProviderIdMapping
    process.env.AIO_events_providermetadata_to_provider_mapping = ''
    getToken.mockReturnValue('accessToken')
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrowError(new Error('No environment variables for provider metadata to provider id mappings found.'))
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
    await expect(hook({ appConfig: { project: mock.data.sampleProjectWithoutEvents, events: mock.data.sampleEvents } })).rejects.toThrowError()
    expect(mockEventsSdkInstance.createRegistration).toBeCalledTimes(1)
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
    await expect(hook({ appConfig: { project: mock.data.sampleProjectWithoutEvents, events: mock.data.sampleEvents } })).resolves.not.toThrowError()
    expect(mockEventsSdkInstance.createRegistration).toBeCalledTimes(1)
    expect(mockEventsSdkInstance.createRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID,
      mock.data.hookDecodedEventRegistration1
    )
  })

  test('successfully create registration with delivery type defined', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    const events = mock.data.sampleEvents
    events.registrations['Event Registration 1'].delivery_type = 'webhook'
    mockEventsSdkInstance.createRegistration.mockReturnValue(mock.data.createWebhookRegistrationResponse)
    const projectWithEmptyEvents = mock.data.sampleProjectWithoutEvents
    projectWithEmptyEvents.workspace.details.events = {}
    await expect(hook({ appConfig: { project: projectWithEmptyEvents, events } })).resolves.not.toThrowError()
    expect(mockEventsSdkInstance.createRegistration).toBeCalledTimes(1)
    expect(mockEventsSdkInstance.createRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID,
      mock.data.hookDecodedEventRegistration1
    )
  })

  test('error in update registration', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    mockEventsSdkInstance.updateRegistration.mockRejectedValueOnce(JSON.stringify({
      code: 500,
      errorDetails: {
        message: 'Internal Server Error'
      }
    }))
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).rejects.toThrowError()
    expect(mockEventsSdkInstance.updateRegistration).toBeCalledTimes(1)
    expect(mockEventsSdkInstance.updateRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID, 'registrationId1',
      mock.data.hookDecodedEventRegistration1
    )
  })

  test('successfully update registration', async () => {
    const hook = require('../../src/hooks/post-deploy-event-reg')
    expect(typeof hook).toBe('function')
    process.env = mock.data.dotEnv
    getToken.mockReturnValue('accessToken')
    mockEventsSdkInstance.updateRegistration.mockReturnValue(mock.data.createWebhookRegistrationResponse)
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).resolves.not.toThrowError()
    expect(mockEventsSdkInstance.updateRegistration).toBeCalledTimes(1)
    expect(mockEventsSdkInstance.updateRegistration).toHaveBeenCalledWith(CONSUMER_ID, PROJECT_ID, WORKSPACE_ID, 'registrationId1',
      mock.data.hookDecodedEventRegistration1
    )
  })
})
