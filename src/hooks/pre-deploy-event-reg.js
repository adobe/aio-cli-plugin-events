const {
  initEventsSdk, getProviderMetadataToProviderIdMapping,
  getDeliveryType, getEventsOfInterestForRegistration, JOURNAL
} = require('./utils/hook-utils')

module.exports = async function ({ appConfig }) {
  console.log('pre-deploy-event-reg ', appConfig.events)
  const project = appConfig.project
  const events = appConfig.events
  if (!project) {
    // this should not be an error, projects can be deployed without a project
    console.log(
      'No project found, skipping event registration in pre-app-deploy hook')
    return
  }
  // this code is also dependent on .env values
  // [SERVICE_API_KEY, AIO_events_providermetadata_to_provider_mapping]
  // so it should return gracefully if they are not present

  console.log(project.name)
  const workspace = {
    name: project.workspace.name,
    id: project.workspace.id
  }
  const eventsSdk = await initEventsSdk(project)
  const orgId = eventsSdk.orgId
  const X_API_KEY = eventsSdk.X_API_KEY
  const eventsClient = eventsSdk.eventsClient
  const registrations = events.registrations
  const providerMetadataToProviderIdMapping = getProviderMetadataToProviderIdMapping()

  for (const registrationName in registrations) {
    const deliveryType = getDeliveryType(registrations[registrationName])
    console.log('Delivery Type of registration ' + registrationName + ' is ' + deliveryType)
    if (deliveryType === JOURNAL) {
      console.log('Creating registration ' + registrationName)
      const body = {
        name: registrationName,
        client_id: X_API_KEY,
        description: registrations[registrationName].description,
        delivery_type: getDeliveryType(registrations[registrationName]),
        events_of_interest: getEventsOfInterestForRegistration(
          registrations[registrationName],
          providerMetadataToProviderIdMapping)
      }
      console.log('Creating registration with body' + body)
      try {
        await eventsClient.createRegistration(orgId, project.id, workspace.id, body)
      } catch (e) {
        console.log(e)
      }
      console.log('Created:' + body)
    }
  }
}
