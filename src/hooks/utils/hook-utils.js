/*
Copyright 2019 Adobe. All rights reserved.
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
const process = require('process')

const WEBHOOK = 'webhook'
const JOURNAL = 'journal'

/**
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
 *
 * @param {*} registration - registration object
 * @param {*} providerMetadataToProviderIdMapping - mapping of provider metadata to provider id
 * @returns {Array} of events of interest {provider_id, event_code}
 */
function getEventsOfInterestForRegistration (registration,
  providerMetadataToProviderIdMapping) {
  const eventsOfInterest = []
  const eventsOfInterestCompressed = registration.events_of_interest
  eventsOfInterestCompressed.forEach(eventOfInterest => {
    const providerId = providerMetadataToProviderIdMapping[eventOfInterest.provider_metadata]
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
 *
 * @param {*} projectConfig - project config object
 * @returns {*} Object containing orgId, X_API_KEY, eventsClient
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
 *
 * @returns {*} Object containing mapping of provider metadata to provider id
 */
function getProviderMetadataToProviderIdMapping () {
  if (!process.env.AIO_events_providermetadata_to_provider_mapping) {
    throw new Error('No environment variables for provider metadata to provider id mappings found.')
  }
  const entries = process.env.AIO_events_providermetadata_to_provider_mapping.split(',')
  const providerMetadataToProviderIdMap = {}
  entries.forEach(providerMetadataToProviderId => {
    const tokens = providerMetadataToProviderId.split(':')
    providerMetadataToProviderIdMap[tokens[0].trim()] = tokens[1].trim()
  })
  return providerMetadataToProviderIdMap
}

/**
 * @param eventRegistrations
 */
function getRegistrationsFromAioConfig (eventRegistrations) {
  const registrationNameToRegistrations = {}
  if (eventRegistrations) {
    for (const registration of eventRegistrations) {
      registrationNameToRegistrations[registration.name] = registration
    }
  }
  return registrationNameToRegistrations
}

/**
 * @param registrationName
 * @param body
 * @param eventsSDK
 * @param registration
 * @param deliveryType
 * @param providerMetadataToProviderIdMapping
 * @param existingRegistration
 * @param project
 */
async function createOrUpdateRegistration (body, eventsSDK, existingRegistration, project) {
  if (existingRegistration) {
    const response = await eventsSDK.eventsClient.updateRegistration(eventsSDK.orgId, project.id, project.workspace.id,
      existingRegistration.registration_id, body)
    console.log('Updated registration:' + JSON.stringify(response))
  } else {
    const response = await eventsSDK.eventsClient.createRegistration(eventsSDK.orgId, project.id,
      project.workspace.id, body)
    console.log('Created registration:' + JSON.stringify(response))
  }
}

/**
 * @param root0
 * @param root0.appConfig
 * @param root0.appConfig.events
 * @param root0.appConfig.project
 * @param expectedDeliveryType
 * @param hookType
 */
async function deployRegistration (
  { appConfig: { events, project } }, expectedDeliveryType, hookType) {
  if (!project) {
    throw new Error(
      `No project found, skipping event registration in ${hookType} hook`)
  }
  if (!events) {
    console.log(
      `No events to register, skipping event registration in ${hookType} hook`)
    return
  }
  const eventsSDK = await initEventsSdk(project)
  if (!eventsSDK.eventsClient) {
    throw new Error(
      `Events SDK could not be initialised correctly. Skipping event registration in ${hookType} hook`)
  }
  const registrations = events.registrations
  const providerMetadataToProviderIdMapping = getProviderMetadataToProviderIdMapping()
  let existingRegistrations
  if (project.workspace.details.events) {
    existingRegistrations = getRegistrationsFromAioConfig(
      project.workspace.details.events.registrations)
  }

  for (const registrationName in registrations) {
    const deliveryType = getDeliveryType(registrations[registrationName])
    if (deliveryType === expectedDeliveryType) {
      const body = {
        name: registrationName,
        client_id: eventsSDK.X_API_KEY,
        description: registrations[registrationName].description,
        delivery_type: deliveryType,
        events_of_interest: getEventsOfInterestForRegistration(
          registrations[registrationName], providerMetadataToProviderIdMapping)
      }
      try {
        let existingRegistration
        if (existingRegistrations && existingRegistrations[registrationName]) { existingRegistration = existingRegistrations[registrationName] }
        await createOrUpdateRegistration(body, eventsSDK,
          existingRegistration, project)
      } catch (e) {
        throw new Error(
          e + '\ncode:' + e.code + '\nDetails:' + JSON.stringify(
            e.sdkDetails))
      }
    }
  }
}

module.exports = {
  WEBHOOK,
  JOURNAL,
  deployRegistration
}
