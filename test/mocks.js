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

const data = {
  getAllProvidersResponse: getAllProvidersResponse,
  getProviderByIdResponse: getProviderByIdResponse,
  getProviderUpdateResponse: getProviderUpdateResponse,
  createProviderWithoutDescAndDocsUrlResponse: createProviderWithoutDescAndDocsUrlResponse,
  updateProviderWithoutDescAndDocsUrlResponse: updateProviderWithoutDescAndDocsUrlResponse,
  eventMetadataSample: eventMetadataSample,
  eventMetadataUpdatedSample: eventMetadataUpdatedSample,
  getAllEventMetadata: getAllEventMetadata
}

module.exports = {
  data: data
}
