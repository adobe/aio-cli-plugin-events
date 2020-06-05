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
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:provider:get', { provider: 'debug' })

class EventmetadataListCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(EventmetadataListCommand)
    try {
      await this.initSdk()
      cli.action.start('Fetching all Event Metadata for provider')
      const eventmetadatas = await this.eventClient.getAllEventMetadataForProvider(args.providerId)
      cli.action.stop()
      if (flags.json) {
        this.printJson(eventmetadatas)
      } else if (flags.yml) {
        this.printYaml(eventmetadatas)
      } else {
        this.printResults(eventmetadatas._embedded.eventmetadata)
      }
    } catch (err) {
      aioLogger.debug(err)
      this.error(err)
    }
    await this.initSdk()
  }

  printResults (projects) {
    const columns = {
      event_code: {
        header: 'EVENT CODE'
      },
      label: {
        header: 'LABEL'
      },
      description: {
        header: 'DESC'
      }
    }
    cli.table(projects, columns)
  }
}

EventmetadataListCommand.description = 'List all event metadata for a provider'

EventmetadataListCommand.args = [
  { name: 'providerId', required: true }
]

EventmetadataListCommand.flags = {
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

module.exports = EventmetadataListCommand
