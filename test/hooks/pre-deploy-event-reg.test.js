const mock = require('../mocks')

jest.mock('@adobe/aio-lib-events')
const eventsSdk = require('@adobe/aio-lib-events')
const mockEventsSdkInstance = {
  createRegistration: jest.fn(),
  updateRegistration: jest.fn()
}
jest.mock('@adobe/aio-lib-ims')

jest.mock('@adobe/aio-lib-ims/src/context')

describe('pre deploy event registration hook interfaces', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    eventsSdk.init.mockResolvedValue(mockEventsSdkInstance)
  })

  test('hook interface', async () => {
    const hook = require('../../src/hooks/pre-deploy-event-reg')
    expect(typeof hook).toBe('function')
  })

  test('no events should return without error', async () => {
    const hook = require('../../src/hooks/pre-deploy-event-reg')
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: { project: mock.data.sampleProject } })).resolves.not.toThrowError()
  })

  test('no events registrations should return without error', async () => {
    const hook = require('../../src/hooks/pre-deploy-event-reg')
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: { registrations: [] } } })).resolves.not.toThrowError()
  })

  test('Registrations of journal type should return without error', async () => {
    const hook = require('../../src/hooks/pre-deploy-event-reg')
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).resolves.not.toThrowError()
  })
})
