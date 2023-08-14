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
    await expect(hook({ appConfig: { project: mock.data.sampleProject } })).resolves.not.toThrow()
  })

  test('no events registrations should return without error', async () => {
    const hook = require('../../src/hooks/pre-deploy-event-reg')
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: { registrations: [] } } })).resolves.not.toThrow()
  })

  test('Registrations of journal type should return without error', async () => {
    const hook = require('../../src/hooks/pre-deploy-event-reg')
    expect(typeof hook).toBe('function')
    await expect(hook({ appConfig: { project: mock.data.sampleProject, events: mock.data.sampleEvents } })).resolves.not.toThrow()
  })
})
