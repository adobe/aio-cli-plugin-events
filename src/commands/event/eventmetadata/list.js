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
const { Flags, CliUx: { ux: cli } } = require('@oclif/core')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:eventmetadata:list', { provider: 'debug' })

class EventmetadataListCommand extends BaseCommand {
  async run () {
    const { args, flags } = await this.parse(EventmetadataListCommand)
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

EventmetadataListCommand.description = 'List all Event Metadata for a Provider'

EventmetadataListCommand.aliases = [
  'event:eventmetadata:ls'
]

EventmetadataListCommand.args = [
  { name: 'providerId', required: true, description: 'The requested provider ID' }
]

EventmetadataListCommand.flags = {
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

module.exports = EventmetadataListCommand
