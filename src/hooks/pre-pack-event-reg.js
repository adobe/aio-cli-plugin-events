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
const { DEFAULT_ENV, getCliEnv } = require('@adobe/aio-lib-env')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:hooks:pre-pack-event-reg', { level: 'info' })

const EVENTS_BASE_URL = {
  prod: 'https://api.adobe.io/events',
  stage: 'https://api-stage.adobe.io/events'
}
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
  if (!response.ok) {
    return response.json()
      .then((responseBody) => {
        throw new Error(JSON.stringify(responseBody))
      })
  }
}

/**
 * Handle request to IO Events ISV Regitration Validate API
 * @param {string} validationUrl IO Events base url based on the cli environment
 * @param {object} registrations The registrations from the App Builder ISV config file
 * @param {object} project The project details of the ISV app
 * @returns {Promise<object>} returns response object of the IO Events ISV validate API call
 */
async function handleRequest (validationUrl, registrations, project) {
  const headers = await getRequestHeaders()
  const url = `${validationUrl}/${project.org.id}/${project.id}/${project.workspace.id}/isv/registrations/validate`
  const fetch = createFetch()
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(registrations)
  }).then((response) => handleResponse(response))
    .then(() => aioLogger.info('Event registrations successfully validated'))
    .catch((error) => {
      throw new Error(`Error validating event registrations ${error}`)
    })
}

/**
 * Extracts list of event registrations to validate by IO events and list of runtime actions to validate against runtimeManifest
 * @param {object} events Event registrations from the app.config.yaml file
 * @param {object[]} registrationsToVerify list of event registrations or empty list
 * @param {string[]} registrationRuntimeActions list of runtime actions associated with the event registrations
 */
function extractRegistrationDetails (events, registrationsToVerify, registrationRuntimeActions) {
  const registrationsFromConfig = events.registrations
  for (const registrationName in registrationsFromConfig) {
    const registration = {
      name: registrationName,
      ...registrationsFromConfig[registrationName]
    }
    registrationsToVerify.push(registration)
    if (!registrationsFromConfig[registrationName].runtime_action) {
      throw new Error(
        'Invalid event registration. All Event registrations need to be associated with a runtime action')
    }
    registrationRuntimeActions.push(registrationsFromConfig[registrationName].runtime_action)
  }
}

/**
 * Extract Map of packages and actions associated with each package
 * @param {object} manifest runtime manifest containing packages and runtime actions
 * @param {object} manifestPackageToRuntimeActionsMap a map containing a mapping between the package name and list of actions in the package
 */
function extractRuntimeManifestDetails (manifest, manifestPackageToRuntimeActionsMap) {
  const runtimePackages = manifest?.full?.packages || {}
  for (const packageName in runtimePackages) {
    if (runtimePackages[packageName].actions) {
      manifestPackageToRuntimeActionsMap[packageName] = runtimePackages[packageName].actions
    }
  }
}

/**
 * Validates the runtime packages and functions associated with event registrations.
 * The following validations are performed:
 * a. runtime manifest contains the package name and action used in events registration
 * b. the actions associated with event registrations are non-web actions
 * @param {object} manifestPackageToRuntimeActionsMap a map containing a mapping between the package name and list of actions in the package
 * @param {object} registrationRuntimeActions list of actions associated with event registrations
 */
function validateRuntimeActionsInEventRegistrations (manifestPackageToRuntimeActionsMap, registrationRuntimeActions) {
  for (const registrationRuntimeAction of registrationRuntimeActions) {
    const packageNameToRuntimeAction = registrationRuntimeAction.split('/')
    if (packageNameToRuntimeAction.length !== 2) {
      throw new Error(`Runtime action ${registrationRuntimeAction} is not correctly defined as part of a package`)
    }
    if (!manifestPackageToRuntimeActionsMap[packageNameToRuntimeAction[0]]) {
      throw new Error(`Runtime manifest does not contain package:
        ${packageNameToRuntimeAction[0]} associated with ${registrationRuntimeAction}
        defined in event registrations`)
    }
    const packageActions = manifestPackageToRuntimeActionsMap[packageNameToRuntimeAction[0]]
    if (!packageActions[packageNameToRuntimeAction[1]]) {
      throw new Error(`Runtime action ${registrationRuntimeAction} associated with the event registration
        does not exist in the runtime manifest`)
    }
    const actionDetails = packageActions[packageNameToRuntimeAction[1]]
    if (actionDetails.web !== 'no') {
      throw new Error(`Invalid runtime action ${registrationRuntimeAction}.
        Only non-web action can be registered for events`)
    }
  }
  aioLogger.info('Validated runtime actions associated with event registrations successfully')
}

module.exports = async function ({ appConfig }) {
  const applicationDetails = appConfig?.all || {}
  if (!applicationDetails || Object.entries(applicationDetails).length === 0) {
    aioLogger.debug('No event registrations to verify, skipping pre-pack events validation hook')
    return
  }
  if (!appConfig?.aio?.project) {
    throw new Error('No project found, error in pre-pack events validation hook')
  }
  const registrationsToVerify = []
  const registrationRuntimeActions = []
  const manifestPackageToRuntimeActionsMap = {}
  Object.entries(applicationDetails).forEach(([extName, extConfig]) => {
    if (extConfig.events) {
      extractRegistrationDetails(extConfig.events, registrationsToVerify,
        registrationRuntimeActions)
    }
    if (extConfig.manifest) {
      extractRuntimeManifestDetails(extConfig.manifest, manifestPackageToRuntimeActionsMap)
    }
  })
  if (registrationsToVerify?.length === 0) {
    aioLogger.debug('No event registrations to verify, skipping pre-pack events validation hook')
    return
  }
  const env = getCliEnv() || DEFAULT_ENV
  const validationUrl = EVENTS_BASE_URL[env]
  validateRuntimeActionsInEventRegistrations(manifestPackageToRuntimeActionsMap, registrationRuntimeActions)
  await handleRequest(validationUrl, registrationsToVerify, appConfig.aio.project)
}
