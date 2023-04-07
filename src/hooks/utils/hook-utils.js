const eventsSdk = require('@adobe/aio-lib-events')
const { CLI } = require('@adobe/aio-lib-ims/src/context')
const { getToken } = require('@adobe/aio-lib-ims')
const process = require('process')

const WEBHOOK = 'webhook'
const JOURNAL = 'journal'

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

function getEventsOfInterestForRegistration (registration,
  providerMetadataToProviderIdMapping) {
  const eventsOfInterest = []
  const eventsOfInterestCompressed = registration.events_of_interest
  eventsOfInterestCompressed.forEach(eventOfInterest => {
    const providerId = providerMetadataToProviderIdMapping[eventOfInterest.provider_metadata]
    const eventCodesList = eventOfInterest.event_codes
    console.log(eventCodesList)
    for (const eventCode of eventCodesList) {
      eventsOfInterest.push({
        provider_id: providerId,
        event_code: eventCode
      })
    }
  })
  return eventsOfInterest
}

async function initEventsSdk (projectConfig) {
  const orgId = projectConfig.org.id
  const orgCode = projectConfig.org.ims_org_id
  const accessToken = await getToken(CLI)
  const X_API_KEY = process.env.SERVICE_API_KEY
  const eventsClient = await eventsSdk.init(orgCode, X_API_KEY, accessToken)
  return { orgId, X_API_KEY, eventsClient }
}

function getProviderMetadataToProviderIdMapping () {
  const entries = process.env.AIO_events_providermetadata_to_provider_mapping.split(',')
  const providerMetadataToProviderIdMap = {}
  entries.forEach(providerMetadataToProviderId => {
    const tokens = providerMetadataToProviderId.split(':')
    providerMetadataToProviderIdMap[tokens[0].trim()] = tokens[1].trim()
  })
  console.log(providerMetadataToProviderIdMap)
  return providerMetadataToProviderIdMap
}

module.exports = {
  initEventsSdk,
  getProviderMetadataToProviderIdMapping,
  getDeliveryType,
  getEventsOfInterestForRegistration,
  WEBHOOK,
  JOURNAL
}
