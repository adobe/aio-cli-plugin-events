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

const {
  JOURNAL, getDeliveryType
} = require('./utils/hook-utils')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:hooks:pre-deploy-event-reg', { level: 'info' })

module.exports = async function ({ appConfig }) {
  if (appConfig && appConfig.events) {
    const registrations = appConfig.events.registrations
    for (const registrationName in registrations) {
      const deliveryType = getDeliveryType(registrations[registrationName])
      if (deliveryType === JOURNAL) {
        aioLogger.debug('Journal registrations are not currently supported.')
        return
      }
    }
  } else {
    aioLogger.debug('No events to register. Skipping pre-deploy-event-reg hook')
  }
}
