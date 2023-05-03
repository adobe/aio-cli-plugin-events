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

const {
  initEventsSdk, getProviderMetadataToProviderIdMapping,
  getDeliveryType, getEventsOfInterestForRegistration, getRegistrationsFromAioConfig, JOURNAL
} = require('./utils/hook-utils')

module.exports = async function ({ appConfig }) {
  const project = appConfig.project
  const events = appConfig.events
  if (!project) {
    throw new Error('No project found, skipping event registration in pre-app-deploy hook')
  }
  const workspace = {
    name: project.workspace.name,
    id: project.workspace.id
  }

  const {orgId, X_API_KEY: clientId, eventsClient} = await initEventsSdk(project)
  if (!eventsClient) {
    throw new Error('Events SDK could not be initialised correctly. Skipping event registration in pre-app-deploy hook')
  }
  const registrations = events.registrations

  const providerMetadataToProviderIdMapping = getProviderMetadataToProviderIdMapping()
  if (!providerMetadataToProviderIdMapping) {
    throw new Error('Required env variables missing. Skipping event registration in pre-app-deploy hook')
  }
  const existingRegistrations = getRegistrationsFromAioConfig(project.workspace.details.registrations)

  for (const registrationName in registrations) {
    const deliveryType = getDeliveryType(registrations[registrationName])
    const body = {
      name: registrationName,
      client_id: clientId,
      description: registrations[registrationName].description,
      delivery_type: getDeliveryType(registrations[registrationName]),
      events_of_interest: getEventsOfInterestForRegistration(
        registrations[registrationName],
        providerMetadataToProviderIdMapping)
    }
    if (deliveryType === JOURNAL) {
      if (existingRegistrations[registrationName]) {
        console.log('Updating registration with name:' + registrationName + ', and registrationId:' +
                        existingRegistrations[registrationName].registration_id)
        await eventsClient.updateRegistration(orgId, project.id, workspace.id,
          existingRegistrations[registrationName].registration_id, body)
        console.log('Updated:' + registrationName)
      } else {
        console.log('Creating registration with name:' + registrationName)
        await eventsClient.createRegistration(orgId, project.id, workspace.id, body)
        console.log('Created:' + registrationName)
      }
    }
  }
}
