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

const BaseCommand = require('../../../BaseCommand.js')
const { flags } = require('@oclif/command')
const { cli } = require('cli-ux')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:eventmetadata:get', { provider: 'debug' })

class EventmetadataGetCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(EventmetadataGetCommand)

    try {
      await this.initSdk()
      cli.action.start('Fetching the event metadata for the provider')
      const eventmetadata = await this.eventClient.getEventMetadataForProvider(args.providerId,
        args.eventCode)
      cli.action.stop()

      if (flags.json) {
        this.printJson(eventmetadata)
      } else if (flags.yml) {
        this.printYaml(eventmetadata)
      } else {
        this.log(JSON.stringify(eventmetadata, null, 2))
      }
    } catch (err) {
      aioLogger.debug(err)
      this.error(err)
    }
  }
}

EventmetadataGetCommand.description = 'Get details of an Event Code of a Provider'

EventmetadataGetCommand.args = [
  { name: 'providerId', required: true },
  { name: 'eventCode', required: true }
]

EventmetadataGetCommand.flags = {
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

module.exports = EventmetadataGetCommand
