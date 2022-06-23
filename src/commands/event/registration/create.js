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

const { Flags, CliUx: { ux: cli } } = require('@oclif/core')
const fs = require('fs')

const BaseCommand = require('../../../BaseCommand')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:registration:create', { provider: 'debug' })

class CreateCommand extends BaseCommand {
  async run () {
    const { args, flags } = await this.parse(CreateCommand)

    try {
      await this.initSdk()

      const body = this.parseJSONFile(args.bodyJSONFile)

      if (!body.client_id) {
        body.client_id = this.conf.integration.jwtClientId
      }
      // other checks are performed by the server

      aioLogger.debug(`create event registration with body ${body}`)
      cli.action.start('Creating new Event Registration')
      const registration = await this.eventClient.createWebhookRegistration(this.conf.org.id, this.conf.integration.id, body)
      cli.action.stop()
      aioLogger.debug(`create successful, id: ${registration.id}, name: ${registration.name}`)

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

CreateCommand.description = 'Create a new Event Registration in your Workspace'

CreateCommand.aliases = [
  'event:reg:create'
]

CreateCommand.flags = {
  ...BaseCommand.flags,
  json: Flags.boolean({
    description: 'Output json',
    char: 'j',
    exclusive: ['yml']
  }),
  yml: Flags.boolean({
    description: 'Output yml',
    char: 'y',
    exclusive: ['json']
  })
}

CreateCommand.args = [
  {
    name: 'bodyJSONFile',
    required: true,
    description: `Path to a file in JSON format with the information to create a new Event Registration.
The JSON should follow the following format:
{
  "name": "<event registration name>",
  "description": "<event registration description>",
  "delivery_type": "WEBHOOK|WEBHOOK_BATCH|JOURNAL",
  "webhook_url": "<webhook URL responding to challenge>",
  "events_of_interest": [{
    "provider_id": "<event provider id>",
    "event_code": "<event provider event_code metadata>"
  }, { /* ...more events */ }]
}`
  }
]

module.exports = CreateCommand
