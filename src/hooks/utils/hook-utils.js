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

const eventsSdk = require('@adobe/aio-lib-events')
const { CLI } = require('@adobe/aio-lib-ims/src/context')
const { getToken } = require('@adobe/aio-lib-ims')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:hooks', { level: 'info' })

const WEBHOOK = 'webhook'
const JOURNAL = 'journal'

/**
 *
 * get the delivery type of the registration
 *
 * @param {object} registration - registration object
 * @returns {string} delivery type of the registration WEBHOOK or JOURNAL
 */
function getDeliveryType (registration) {
  if (registration.delivery_type) {
    return registration.delivery_type
  } else if (registration.webhook_url != null || registration.runtime_action !=
        null) {
    return WEBHOOK
  } else {
    return JOURNAL
  }
}

/**
 * @private
 * @param {object} registration - registration object
 * @param {object} providerMetadataToProviderIdMapping - mapping of provider metadata to provider id
 * @returns {Array} of events of interest {provider_id, event_code}
 */
function getEventsOfInterestForRegistration (registration,
  providerMetadataToProviderIdMapping) {
  const eventsOfInterest = []
  const eventsOfInterestCompressed = registration.events_of_interest
  eventsOfInterestCompressed.forEach(eventOfInterest => {
    const providerId = providerMetadataToProviderIdMapping[eventOfInterest.provider_metadata]
    if (!providerId) {
      throw new Error(
            `No provider id mapping found for provider metadata ${eventOfInterest.provider_metadata}. Skipping event registration`)
    }
    const eventCodesList = eventOfInterest.event_codes
    for (const eventCode of eventCodesList) {
      eventsOfInterest.push({
        provider_id: providerId,
        event_code: eventCode
      })
    }
  })
  return eventsOfInterest
}

/**
 * @private
 * @param {object} projectConfig - project config object
 * @returns {object} Object containing orgId, X_API_KEY, eventsClient
 */
async function initEventsSdk (projectConfig) {
  const orgId = projectConfig.org.id
  const orgCode = projectConfig.org.ims_org_id
  const X_API_KEY = process.env.SERVICE_API_KEY
  if (!X_API_KEY) {
    throw new Error('Required SERVICE_API_KEY is missing from .env file')
  }
  const accessToken = await getToken(CLI)
  const eventsClient = await eventsSdk.init(orgCode, X_API_KEY, accessToken)
  return { orgId, X_API_KEY, eventsClient }
}

/**
 * @private
 * @returns {object} Object containing mapping of provider metadata to provider id
 */
function getProviderMetadataToProviderIdMapping () {
  if (!process.env.AIO_EVENTS_PROVIDERMETADATA_TO_PROVIDER_MAPPING) {
    throw new Error('No environment variables for provider metadata to provider id mappings found.')
  }
  const entries = process.env.AIO_EVENTS_PROVIDERMETADATA_TO_PROVIDER_MAPPING.split(',')
  const providerMetadataToProviderIdMap = {}
  entries.forEach(providerMetadataToProviderId => {
    const tokens = providerMetadataToProviderId.split(':')
    providerMetadataToProviderIdMap[tokens[0].trim()] = tokens[1].trim()
  })
  return providerMetadataToProviderIdMap
}

/**
 * @private
 * @param {object} eventRegistrations - registrations from the .aio config file
 * @returns {object} Object containing mapping of registration name to registration object
 */
function getRegistrationNameToRegistrationsMap (eventRegistrations) {
  const registrationNameToRegistrations = {}
  for (const registration of eventRegistrations) {
    registrationNameToRegistrations[registration.name] = registration
  }
  return registrationNameToRegistrations
}

/**
 * @private
 * @param {Array.<string>} workspaceRegistrationNames Registration names from the Console workspace
 * @param {Array.<string>} appConfigRegistrationNames Registration names defined in the app.config.yaml file
 * @returns {Array.<string>} Registrations that are part of the workspace, but not part of the app.config.yaml
 */
function getWorkspaceRegistrationsToBeDeleted (workspaceRegistrationNames, appConfigRegistrationNames) {
  return workspaceRegistrationNames.filter(wsRegistration => !appConfigRegistrationNames.includes(wsRegistration))
}

/**
 * @private
 * @param {object} body - Registration Create/Update Model
 * @param {object} eventsSDK - eventsSDK object containing eventsClient and orgId
 * @param {object} existingRegistration - existing registration obtained from .aio config if exists
 * @param {object} project - project details from .aio config file
 */
async function createOrUpdateRegistration (body, eventsSDK, existingRegistration, project) {
  if (existingRegistration) {
    const response = await eventsSDK.eventsClient.updateRegistration(eventsSDK.orgId, project.id, project.workspace.id,
      existingRegistration.registration_id, body)
    aioLogger.info('Updated registration with name:' + response.name + ' and id:' + response.registration_id)
  } else {
    const response = await eventsSDK.eventsClient.createRegistration(eventsSDK.orgId, project.id,
      project.workspace.id, body)
    aioLogger.info('Created registration:' + response.name + ' and id:' + response.registration_id)
  }
}

/**
 * @private
 * @param {object} eventsSDK - eventsSDK object containing eventsClient and orgId
 * @param {object} existingRegistration - existing registration obtained from .aio config if exists
 * @param {object} project - project details from .aio config file
 */
async function deleteRegistration (eventsSDK, existingRegistration, project) {
  await eventsSDK.eventsClient.deleteRegistration(eventsSDK.orgId, project.id, project.workspace.id,
    existingRegistration.registration_id)
  aioLogger.info('Deleted registration with name:' + existingRegistration.name + ' and id:' + existingRegistration.registration_id)
}

/**
 * @private
 * @param {object} eventsSDK - eventsSDK object containing eventsClient and orgId
 * @param {object} project - project details from .aio config file
 * @returns {object} Object containing all registrations for the workspace
 */
async function getAllRegistrationsForWorkspace (eventsSDK, project) {
  const registrationsForWorkspace = await eventsSDK.eventsClient.getAllRegistrationsForWorkspace(eventsSDK.orgId, project.id,
    project.workspace.id)
  if (!registrationsForWorkspace) { return {} }
  return getRegistrationNameToRegistrationsMap(registrationsForWorkspace._embedded.registrations)
}

/**
 * @param {object} appConfigRoot - Root object containing events and project details
 * @param {object} appConfigRoot.appConfig - Object containing events and project details
 * @param {object} appConfigRoot.appConfig.project - Project details from the .aio file
 * @param {object} appConfigRoot.appConfig.events - Events registrations that are part of the app.config.yaml file
 * @param {string} expectedDeliveryType - Delivery type based on the hook that is calling. Expected delivery type can be webhook or journal
 * @param {string} hookType - pre-deploy-event-reg or post-deploy-event-reg hook values
 * @param {boolean} forceEventsFlag - determines if registrations that are part of the workspace but not part of the app.config.yaml will be deleted or not
 */
async function deployRegistration ({ appConfig: { events, project } }, expectedDeliveryType, hookType, forceEventsFlag) {
  if (!project) {
    aioLogger.debug(`No project found, skipping event registration in ${hookType} hook`)
    return
  }
  if (!events) {
    aioLogger.debug(`No events to register, skipping event registration in ${hookType} hook`)
    return
  }
  const eventsSDK = await initEventsSdk(project)
  if (!eventsSDK.eventsClient) {
    throw new Error(
            `Events SDK could not be initialised correctly. Skipping event registration in ${hookType} hook`)
  }
  const registrationsFromConfig = events.registrations
  const registrationsFromWorkspace = await getAllRegistrationsForWorkspace(eventsSDK, project)
  const providerMetadataToProviderIdMapping = getProviderMetadataToProviderIdMapping()
  for (const registrationName in registrationsFromConfig) {
    const deliveryType = getDeliveryType(registrationsFromConfig[registrationName])
    if (deliveryType === expectedDeliveryType) {
      const body = {
        name: registrationName,
        client_id: eventsSDK.X_API_KEY,
        description: registrationsFromConfig[registrationName].description,
        delivery_type: deliveryType,
        runtime_action: registrationsFromConfig[registrationName].runtime_action,
        events_of_interest: getEventsOfInterestForRegistration(
          registrationsFromConfig[registrationName], providerMetadataToProviderIdMapping)
      }
      try {
        let existingRegistration
        if (registrationsFromWorkspace && registrationsFromWorkspace[registrationName]) { existingRegistration = registrationsFromWorkspace[registrationName] }
        await createOrUpdateRegistration(body, eventsSDK, existingRegistration, project)
      } catch (e) {
        throw new Error(
          e + '\ncode:' + e.code + '\nDetails:' + JSON.stringify(
            e.sdkDetails))
      }
    }
  }

  if (forceEventsFlag) {
    const registrationsToDeleted = getWorkspaceRegistrationsToBeDeleted(Object.keys(registrationsFromWorkspace), Object.keys(registrationsFromConfig))
    aioLogger.info('The following registrations will be deleted: ', registrationsToDeleted)
    for (const registrationName of registrationsToDeleted) {
      try {
        await deleteRegistration(eventsSDK, registrationsFromWorkspace[registrationName], project)
      } catch (e) {
        throw new Error(
          e + '\ncode:' + e.code + '\nDetails:' + JSON.stringify(
            e.sdkDetails))
      }
    }
  }
}

/**
 * @param {object} appConfigRoot - Root object containing events and project details
 * @param {object} appConfigRoot.appConfig - Object containing events and project details
 * @param {object} appConfigRoot.appConfig.project - Project details from the .aio file
 * @param {object} appConfigRoot.appConfig.events - Events registrations that are part of the app.config.yaml file
 */
async function undeployRegistration ({ appConfig: { events, project } }) {
  if (!project) {
    aioLogger.debug('No project with events to delete, skipping deletion of event registrations')
    return
  }
  if (!events) {
    aioLogger.debug('No events to delete, skipping deletion of event registrations')
    return
  }
  const eventsSDK = await initEventsSdk(project)
  if (!eventsSDK.eventsClient) {
    throw new Error(
      'Events SDK could not be initialised correctly. Skipping deletion of event registrations')
  }
  const registrationsFromConfig = events.registrations
  const registrationsFromWorkspace = await getAllRegistrationsForWorkspace(eventsSDK, project)
  if (Object.keys(registrationsFromWorkspace).length === 0) {
    aioLogger.debug('No events to delete, skipping deletion of event registrations')
    return
  }
  for (const registrationName in registrationsFromConfig) {
    try {
      if (registrationsFromWorkspace[registrationName]) {
        await deleteRegistration(eventsSDK, registrationsFromWorkspace[registrationName], project)
      }
    } catch (e) {
      throw new Error(
        e + '\ncode:' + e.code + '\nDetails:' + JSON.stringify(
          e.sdkDetails))
    }
  }
}

module.exports = {
  WEBHOOK,
  JOURNAL,
  deployRegistration,
  undeployRegistration,
  getDeliveryType
}
