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
const { CLI } = require('@adobe/aio-lib-ims/src/context')
const { getToken } = require('@adobe/aio-lib-ims')
const { createFetch } = require('@adobe/aio-lib-core-networking')
const validationUrl = 'https://api.adobe.io/events'

/**
 * @returns {Promise<object>} returns headers required to make a call to the IO Events ISV validate endpoint
 */
async function getRequestHeaders () {
  const X_API_KEY = process.env.SERVICE_API_KEY
  if (!X_API_KEY) {
    throw new Error('Required SERVICE_API_KEY is missing from .env file')
  }
  const accessToken = await getToken(CLI)
  const headers = {}
  headers.Authorization = 'Bearer ' + accessToken
  headers['Content-Type'] = 'application/json'
  headers['x-api-key'] = X_API_KEY
  return headers
}

/**
 * Handle error response
 * @param {object} response The error response object obtained from making a call to the IO Events ISV validate API
 * @returns {Promise<object>} returns response body of the IO Events ISV validate API call
 */
async function handleResponse (response) {
  return response.json()
    .then((responseBody) => {
      if (!response.ok) {
        console.log(`Error in validating event registrations: ${JSON.stringify(responseBody)}`)
        throw new Error(JSON.stringify(responseBody))
      }
      return responseBody
    })
}

/**
 * Handle request to IO Events ISV Regitration Validate API
 * @param {object} registrations The registrations from the App Builder ISV config file
 * @param {object} project The project details of the ISV app
 * @returns {Promise<object>} returns response object of the IO Events ISV validate API call
 */
async function handleRequest (registrations, project) {
  const headers = await getRequestHeaders()
  const url = `${validationUrl}/${project.org.id}/${project.id}/${project.workspace.id}/isv/registrations/validate`
  const fetch = createFetch()
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(registrations)
  }).then((response) => handleResponse(response))
    .then(() => console.log('Event registrations successfully validated'))
    .catch((error) => {
      console.log(`Error validating event registrations ${error}`)
      throw new Error(error)
    })
}

module.exports = async function ({ appConfig: { all: { application: { events, project } } } }) {
  if (!project) {
    throw new Error(
      'No project found, error in pre-pack events validation hook')
  }
  if (!(events?.registrations)) {
    console.log('No event registrations to verify, skipping pre-pack events validation hook')
    return
  }
  const registrationsToVerify = []
  const registrationsFromConfig = events.registrations
  for (const registrationName in registrationsFromConfig) {
    const registration = {
      name: registrationName,
      ...registrationsFromConfig[registrationName]
    }
    registrationsToVerify.push(registration)
  }
  await handleRequest(registrationsToVerify, project)
}
