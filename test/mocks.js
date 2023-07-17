/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const getAllProvidersResponse = {
  _links: {
    self: {
      href: 'https://api.adobe.io/events/consumerOrgId/providers'
    }
  },
  _embedded: {
    providers: [
      {
        _links: {
          'rel:eventmetadata': {
            href: 'https://api.adobe.io/events/providers/test-id-1/eventmetadata'
          },
          'rel:update': {
            href: 'https://api.adobe.io/events/consumerId/projectId/workspaceId/providers/test-id-1'
          },
          self: {
            href: 'https://api.adobe.io/events/providers/test-id-1'
          }
        },
        id: 'ID01',
        description: 'DESC01',
        label: 'LABEL01',
        source: 'urn:uuid:source1',
        docs_url: 'DOCS01',
        publisher: 'Adobe'
      },
      {
        _links: {
          'rel:eventmetadata': {
            href: 'https://api.adobe.io/events/providers/test-id-2/eventmetadata'
          },
          'rel:update': {
            href: 'https://api.adobe.io/events/consumerId/projectId/workspaceId/providers/test-id-2'
          },
          self: {
            href: 'https://api.adobe.io/events/providers/test-id-2'
          }
        },
        id: 'ID02',
        description: 'DESC02',
        label: 'LABEL02',
        source: 'urn:uuid:source2',
        docs_url: 'DOCS02',
        publisher: 'adobeOrg@AdobeOrg'
      },
      {
        _links: {
          'rel:eventmetadata': {
            href: 'https://api.adobe.io/events/providers/test-id-3/eventmetadata'
          },
          'rel:update': {
            href: 'https://api.adobe.io/events/consumerId/projectId/workspaceId/providers/test-id-3'
          },
          self: {
            href: 'https://api.adobe.io/events/providers/test-id-3'
          }
        },
        id: 'ID03',
        description: 'DESC03',
        label: 'LABEL03',
        source: 'urn:uuid:source3',
        docs_url: 'DOCS03',
        publisher: 'adobeOrg@AdobeOrg'
      }
    ]
  }
}

const getProviderByIdResponse = {
  _links: {
    'rel:eventmetadata': {
      href: 'https://api.adobe.io/events/providers/ID01/eventmetadata'
    },
    'rel:update': {
      href: 'https://api.adobe.io/events/consumerOrgId/projectId/workspaceId/providers/ID01'
    },
    self: {
      href: 'https://api.adobe.io/events/providers/ID01?eventmetadata=false'
    }
  },
  id: 'ID01',
  label: 'LABEL01',
  description: 'DESC01',
  source: 'urn:uuid:ID01',
  docs_url: 'DOCS01',
  publisher: '123@AdobeOrg'
}

const createProviderWithoutDescAndDocsUrlResponse = {
  _links: {
    'rel:eventmetadata': {
      href: 'https://api.adobe.io/events/providers/ID01/eventmetadata'
    },
    'rel:update': {
      href: 'https://api.adobe.io/events/consumerOrgId/projectId/workspaceId/providers/ID01'
    },
    self: {
      href: 'https://api.adobe.io/events/providers/ID01?eventmetadata=false'
    }
  },
  id: 'ID01',
  label: 'LABEL01',
  description: 'A custom events provider, registered by your organization.',
  source: 'urn:uuid:ID01',
  publisher: '123@AdobeOrg'
}

const updateProviderWithoutDescAndDocsUrlResponse = {
  _links: {
    'rel:eventmetadata': {
      href: 'https://api.adobe.io/events/providers/ID01/eventmetadata'
    },
    'rel:update': {
      href: 'https://api.adobe.io/events/consumerOrgId/projectId/workspaceId/providers/ID01'
    },
    self: {
      href: 'https://api.adobe.io/events/providers/ID01?eventmetadata=false'
    }
  },
  id: 'ID01',
  label: 'LABEL04',
  description: 'A custom events provider, registered by your organization.',
  source: 'urn:uuid:ID01',
  publisher: '123@AdobeOrg'
}

const getProviderUpdateResponse = {
  _links: {
    'rel:eventmetadata': {
      href: 'https://api.adobe.io/events/providers/ID01/eventmetadata'
    },
    'rel:update': {
      href: 'https://api.adobe.io/events/consumerOrgId/projectId/workspaceId/providers/ID01'
    },
    self: {
      href: 'https://api.adobe.io/events/providers/ID01?eventmetadata=false'
    }
  },
  id: 'ID01',
  label: 'LABEL04',
  description: 'DESC04',
  source: 'urn:uuid:ID01',
  publisher: '123@AdobeOrg'
}

const eventMetadataSample = {
  _links: {
    'rel:sample_event': {
      href: 'https://api.adobe.io/events/providers/ID01/eventmetadata/com.adobe.CODE01/sample_event'
    },
    'rel:update': {
      href: 'https://api.adobe.io/events/consumerId/projectId/workspaceId/providers/ID01/eventmetadata/com.adobe.CODE01'
    },
    self: {
      href: 'https://api.adobe.io/events/providers/ID01/eventmetadata/com.adobe.CODE01'
    }
  },
  label: 'LABEL01',
  description: 'DESC01',
  event_code: 'com.adobe.CODE01'
}

const eventMetadataUpdatedSample = {
  _links: {
    'rel:sample_event': {
      href: 'https://api.adobe.io/events/providers/ID01/eventmetadata/com.adobe.CODE01/sample_event'
    },
    'rel:update': {
      href: 'https://api.adobe.io/events/consumerId/projectId/workspaceId/providers/ID01/eventmetadata/com.adobe.CODE01'
    },
    self: {
      href: 'https://api.adobe.io/events/providers/ID01/eventmetadata/com.adobe.CODE01'
    }
  },
  label: 'LABEL04',
  description: 'DESC04',
  event_code: 'com.adobe.CODE01'
}

const getAllEventMetadata = {
  _links: {
    self: {
      href: 'https://api.adobe.io/events/providers/ID01/eventmetadata'
    }
  },
  _embedded: {
    eventmetadata: [
      {
        _links: {
          'rel:sample_event': {
            href: 'https://api.adobe.io/events/providers/ID01/eventmetadata/com.adobe.CODE01/sample_event'
          },
          'rel:update': {
            href: 'https://api.adobe.io/events/consumerId/projectId/workspaceId/providers/ID01/eventmetadata/com.adobe.CODE01'
          },
          self: {
            href: 'https://api.adobe.io/events/providers/ID01/eventmetadata/com.adobe.CODE01'
          }
        },
        description: 'DESC01',
        label: 'LABEL01',
        event_code: 'com.adobe.CODE01'
      },
      {
        _links: {
          'rel:sample_event': {
            href: 'https://api.adobe.io/events/providers/ID01/eventmetadata/com.adobe.CODE02/sample_event'
          },
          'rel:update': {
            href: 'https://api.adobe.io/events/consumerId/projectId/workspaceId/providers/ID01/eventmetadata/com.adobe.CODE02'
          },
          self: {
            href: 'https://api.adobe.io/events/providers/ID01/eventmetadata/com.adobe.CODE02'
          }
        },
        description: 'DESC02',
        label: 'LABEL2',
        event_code: 'CODE02'
      }
    ]
  }
}

const getWebhookRegistrationResponse = {
  _links: {
    'rel:events': {
      href: 'https://events-va6.adobe.io/events/organizations/consumerOrgId/integrations/integrationId/REGID1'
    },
    'rel:trace': {
      href: 'https://eventtraces-va6.adobe.io/traces/consumerOrgId/projectId/workspaceId/registration/REGID1'
    },
    self: {
      href: 'https://api.adobe.io/events/consumerOrgId/projectId/workspaceId/registrations/REGID1'
    }
  },
  id: 11111,
  name: 'bowling 1',
  description: 'let me know when we can go play bowling!',
  client_id: '1234654902189324798',
  webhook_url: 'https://send-me-a-bowling-event.com/right-now',
  webhook_status: 'verified',
  enabled: 'true',
  events_of_interest: [
    {
      event_code: 'com.adobe.bowling',
      provider_id: 'IDP1',
      provider: '3rd_party_custom_events_ORG@AdobeOrg_IDP01',
      provider_label: 'bowling',
      provider_description: "let's play bowling",
      event_delivery_format: 'cloud_events_v1'
    }
  ],
  registration_id: 'REGID1',
  delivery_type: 'webhook',
  created_date: '2020-06-12T13:53:59.363Z',
  updated_date: '2020-06-12T13:53:59.363Z'
}

const createWebhookRegistrationResponse = {
  ...getWebhookRegistrationResponse
}

const getAllWebhookRegistrationsWithEmptyResponse = {
  _embedded: {
    registrations: []
  }
}

const getAllWebhookRegistrationsResponse = {
  _embedded: {
    registrations: [
      {
        _links: {
          'rel:events': {
            href: 'https://events-va6.adobe.io/events/organizations/consumerOrgId/integrations/integrationId/REGID1'
          },
          'rel:trace': {
            href: 'https://eventtraces-va6.adobe.io/traces/consumerOrgId/projectId/workspaceId/registration/REGID1'
          },
          self: {
            href: 'https://api.adobe.io/events/consumerOrgId/projectId/workspaceId/registrations/REGID1'
          }
        },
        id: 11111,
        name: 'Event Registration 1',
        description: 'let me know when we can go play bowling!',
        client_id: '1234654902189324798',
        webhook_url: 'https://send-me-a-bowling-event.com/right-now',
        webhook_status: 'verified',
        enabled: 'true',
        events_of_interest: [
          {
            event_code: 'com.adobe.bowling',
            provider_id: 'IDP1',
            provider: '3rd_party_custom_events_ORG@AdobeOrg_IDP01',
            provider_label: 'bowling',
            provider_description: "let's play bowling",
            event_delivery_format: 'cloud_events_v1'
          }
        ],
        registration_id: 'REGID1',
        delivery_type: 'webhook',
        created_date: '2020-06-12T13:53:59.363Z',
        updated_date: '2020-06-12T13:53:59.363Z'
      },
      {
        _links: {
          'rel:events': {
            href: 'https://events-va6.adobe.io/events/organizations/consumerOrgId/integrations/integrationId/REGID2'
          },
          'rel:trace': {
            href: 'https://eventtraces-va6.adobe.io/traces/consumerOrgId/projectId/workspaceId/registration/REGID2'
          },
          self: {
            href: 'https://api.adobe.io/events/consumerOrgId/projectId/workspaceId/registrations/REGID2'
          }
        },
        id: 22222,
        name: 'Event Registration 2',
        description: 'registration for table tennis events',
        client_id: '1234654902189324798',
        webhook_url: 'https://send-me-a-table-tennis-event.com/please',
        webhook_status: 'verified',
        enabled: true,
        events_of_interest: [
          {
            event_code: 'com.adobe.table.tennis',
            provider_id: 'IDP2',
            provider: '3rd_party_custom_events_ORG@AdobeOrg_IDP02',
            provider_label: 'table-tennis',
            provider_description: "let's play table tennis",
            event_delivery_format: 'cloud_events_v1'
          }
        ],
        registration_id: 'REGID2',
        delivery_type: 'webhook',
        created_date: '2020-06-12T13:53:59.363Z',
        updated_date: '2020-06-12T13:53:59.363Z'
      }
    ]
  }
}

const createWebhookRegistrationInputJSON = {
  name: 'bowling 1',
  description: 'let me know when we can go play bowling!',
  webhook_url: 'https://send-me-a-bowling-event.com/right-now',
  client_id: '1234654902189324798',
  delivery_type: 'webhook',
  events_of_interest: [{
    event_code: 'com.adobe.bowling',
    provider_id: 'IDP1'
  }]
}

const createWebhookRegistrationInputJSONNoClientId = {
  name: 'bowling 1',
  description: 'let me know when we can go play bowling!',
  webhook_url: 'https://send-me-a-bowling-event.com/right-now',
  delivery_type: 'webhook',
  events_of_interest: [{
    event_code: 'com.adobe.bowling',
    provider_id: 'IDP1'
  }]
}

const sampleProject = {
  id: 'projectId',
  name: 'projectName',
  title: 'ProjectTitle',
  description: 'Test description',
  org: {
    id: '112233',
    name: 'Organisation Name',
    ims_org_id: '123@AdobeOrg',
    details: {
      services: [
        {
          name: 'I/O Management API',
          code: 'apiCode',
          type: 'entp'
        }
      ]
    }
  },
  workspace: {
    id: 'workspaceId',
    name: 'Stage',
    action_url: 'https://action_name.adobeioruntime.net',
    app_url: 'https://action_name.adobeio-static.net',
    details: {
      credentials: [
        {
          id: 'credentialId',
          name: 'credentialName',
          integration_type: 'service'
        }
      ],
      services: [
        {
          code: 'apiCode',
          name: 'I/O Management API'
        }
      ],
      events: {
        registrations: [
          {
            id: 0,
            name: 'Event Registration 1',
            description: 'description',
            client_id: 'clientId',
            registration_id: 'registrationId1',
            events_of_interest: [
              {
                provider: 'providerName',
                event_code: 'eventCode1',
                provider_id: 'providerId',
                event_label: 'Sample event code',
                event_description: 'Sample event code',
                provider_label: 'Sample provider',
                provider_description: 'Test provider',
                event_delivery_format: 'adobe_io',
                provider_metadata: 'providerMetadata1'
              }
            ],
            webhook_status: 'verified',
            created_date: 'string',
            updated_date: 'string',
            webhook_url: 'https://test-webhook.io',
            delivery_type: 'webhook',
            runtime_action: 'action-name',
            enabled: true,
            events_url: 'https://journal.adobe.io/events',
            trace_url: 'https://trace.adobe.io/traces'
          },
          {
            id: 0,
            name: 'Event Registration 2',
            description: 'description2',
            client_id: 'clientId',
            registration_id: 'registrationId2',
            events_of_interest: [
              {
                provider: 'providerName',
                event_code: 'eventCode2',
                provider_id: 'providerId2',
                event_label: 'Sample event code',
                event_description: 'Sample event code',
                provider_label: 'Sample provider',
                provider_description: 'Test provider',
                event_delivery_format: 'adobe_io',
                provider_metadata: 'providerMetadata2'
              }
            ],
            webhook_status: 'verified',
            created_date: 'string',
            updated_date: 'string',
            delivery_type: 'journal',
            enabled: true,
            events_url: 'https://journal.adobe.io/events',
            trace_url: 'https://trace.adobe.io/traces'
          }
        ]
      }
    },
    endpoints: {
      packageName: {
        view: [
          {
            href: 'https://action-name.adobeio-static.net/index.html',
            metadata: {
              services: [
                {
                  code: 'apiCode',
                  name: 'I/O Management API'
                }
              ],
              profile: {
                client_id: 'clientId',
                scope: 'scopes'
              }
            }
          }
        ]
      }
    }
  }
}

const sampleProjectWithoutEvents = {
  id: 'projectId',
  name: 'projectName',
  title: 'ProjectTitle',
  description: 'Test description',
  org: {
    id: '112233',
    name: 'Organisation Name',
    ims_org_id: '123@AdobeOrg',
    details: {
      services: [
        {
          name: 'I/O Management API',
          code: 'apiCode',
          type: 'entp'
        }
      ]
    }
  },
  workspace: {
    id: 'workspaceId',
    name: 'Stage',
    action_url: 'https://action_name.adobeioruntime.net',
    app_url: 'https://action_name.adobeio-static.net',
    details: {
      credentials: [
        {
          id: 'credentialId',
          name: 'credentialName',
          integration_type: 'service'
        }
      ],
      services: [
        {
          code: 'apiCode',
          name: 'I/O Management API'
        }
      ]
    },
    endpoints: {
      packageName: {
        view: [
          {
            href: 'https://action-name.adobeio-static.net/index.html',
            metadata: {
              services: [
                {
                  code: 'apiCode',
                  name: 'I/O Management API'
                }
              ],
              profile: {
                client_id: 'clientId',
                scope: 'scopes'
              }
            }
          }
        ]
      }
    }
  }
}

const sampleEvents = {
  registrations: {
    'Event Registration 1': {
      description: 'Registration for IO Events 1',
      events_of_interest: [
        {
          provider_metadata: 'providerMetadata1',
          event_codes: [
            'eventCode1',
            'eventCode2'
          ]
        }
      ],
      runtime_action: 'poc-event-1'
    },
    'Event Registration 2': {
      description: 'Registration for IO Events 2',
      events_of_interest: [
        {
          provider_metadata: 'providerMetadata1',
          event_codes: [
            'eventCode1',
            'eventCode2'
          ]
        },
        {
          provider_metadata: 'providerMetadata2',
          event_codes: [
            'eventCode3'
          ]
        }
      ]
    }
  }
}

const hookDecodedEventRegistration1 = {
  name: 'Event Registration 1',
  client_id: 'serviceApiKey',
  description: 'Registration for IO Events 1',
  delivery_type: 'webhook',
  runtime_action: 'poc-event-1',
  events_of_interest: [{
    provider_id: 'providerId1',
    event_code: 'eventCode1'
  },
  {
    provider_id: 'providerId1',
    event_code: 'eventCode2'
  }]
}

const hookDecodedEventRegistration2 = {
  name: 'Event Registration 2',
  client_id: 'serviceApiKey',
  description: 'Registration for IO Events 2',
  delivery_type: 'journal',
  events_of_interest: [{
    provider_id: 'providerId1',
    event_code: 'eventCode1'
  },
  {
    provider_id: 'providerId1',
    event_code: 'eventCode2'
  },
  {
    provider_id: 'providerId2',
    event_code: 'eventCode3'
  }]
}

const dotEnv = {
  AIO_runtime_auth: 'runtimeAuth',
  AIO_runtime_namespace: 'namespace',
  AIO_runtime_apihost: 'https://adobeioruntime.net',
  SERVICE_API_KEY: 'serviceApiKey',
  API_KEY: 'apiKey',
  AIO_events_providermetadata_to_provider_mapping: 'providerMetadata1:providerId1,providerMetadata2:providerId2'
}

const dotEnvMissingApiKey = {
  AIO_runtime_auth: 'runtimeAuth',
  AIO_runtime_namespace: 'namespace',
  AIO_runtime_apihost: 'https://adobeioruntime.net',
  AIO_events_providermetadata_to_provider_mapping: 'providerMetadata1:providerId1,providerMetadata2:providerId2'
}

const dotEnvMissingProviderMetadataToProviderIdMapping = {
  AIO_runtime_auth: 'runtimeAuth',
  AIO_runtime_namespace: 'namespace',
  AIO_runtime_apihost: 'https://adobeioruntime.net',
  SERVICE_API_KEY: 'serviceApiKey',
  API_KEY: 'apiKey'
}
const data = {
  getAllProvidersResponse,
  getProviderByIdResponse,
  getProviderUpdateResponse,
  createProviderWithoutDescAndDocsUrlResponse,
  updateProviderWithoutDescAndDocsUrlResponse,
  eventMetadataSample,
  eventMetadataUpdatedSample,
  getAllEventMetadata,
  createWebhookRegistrationResponse,
  getAllWebhookRegistrationsResponse,
  getAllWebhookRegistrationsWithEmptyResponse,
  getWebhookRegistrationResponse,
  createWebhookRegistrationInputJSON,
  createWebhookRegistrationInputJSONNoClientId,
  sampleProject,
  sampleEvents,
  hookDecodedEventRegistration1,
  hookDecodedEventRegistration2,
  sampleProjectWithoutEvents,
  dotEnv,
  dotEnvMissingApiKey,
  dotEnvMissingProviderMetadataToProviderIdMapping
}

module.exports = {
  data
}
