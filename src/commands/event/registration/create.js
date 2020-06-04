/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { flags } = require('@oclif/command')
const { cli } = require('cli-ux')
const fs = require('fs')

const BaseCommand = require('../../../BaseCommand')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:registration:list', { provider: 'debug' })

class GetCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(GetCommand)

    try {
      await this.initSdk()

      const body = this.parseJSONFile(args.bodyJSONFile)
      if (!body.client_id) {
        body.client_id = this.conf.integration.jwtClientId
      }
      if (!body.delivery_type) {
        body.delivery_type = 'JOURNAL'
      }
      if (body.delivery_type === 'JOURNAL' && body.webhook_url) {
        throw new Error('\'webhook_url\' is not allowed if \'delivery_type\' is \'JOURNAL\'')
      }
      // todo further validation needs to be implemented in the event lib

      aioLogger.debug(`Creating an Event Registration from input file ${args.file}`)

      cli.action.start('Creating new Event Registration')
      const registration = await this.eventClient.createWebhookRegistration(this.conf.org.id, this.conf.integration.id, body)
      cli.action.stop()

      aioLogger.debug('Listing Registrations: Data Received')

      if (flags.json) {
        this.printJson(registration)
      } else if (flags.yml) {
        this.printYaml(registration)
      } else {
        // for now let's print a beautified json
        this.log(JSON.stringify(registration, null, 2))
      }
    } catch (err) {
      aioLogger.debug(err)
      this.error(err)
    }
  }

  /** @private */
  parseJSONFile (file) {
    const bodyText = fs.readFileSync(file).toString()
    try {
      return JSON.parse(bodyText)
    } catch (e) {
      throw new Error(`${file} is not a valid JSON file`)
    }
  }
}

GetCommand.description = 'Create a new Event Registration in your Workspace'

GetCommand.aliases = [
  'console:reg:get'
]

GetCommand.flags = {
  ...BaseCommand.flags,
  json: flags.boolean({
    description: 'Output json',
    char: 'j',
    exclusive: ['yml']
  }),
  yml: flags.boolean({
    description: 'Output yml',
    char: 'y',
    exclusive: ['json']
  })
}

GetCommand.args = [
  {
    name: 'bodyJSONFile',
    required: true,
    description: `Path to a file in JSON format with the information to create a new Event Registration.
The JSON should follow the following format:
{
  "name": "<event registration name>",
  "description": "<event registration description>",
  "delivery_type": "WEBHOOK|WEBHOOK_BATCH|JOURNAL",
  "webhook_url": "<webhook URL responding to challenge>"
  "events_of_interest": [{
    "provider_id": "<event provider id>"
    "event_code": "<event provider event_code metadata>"
  }, { <...more events> }]
}`
  }
]

module.exports = GetCommand
