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
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:provider:list', { provider: 'debug' })

class ProviderListCommand extends BaseCommand {
  async run () {
    const { flags } = await this.parse(ProviderListCommand)
    try {
      await this.initSdk()
      cli.action.start('Fetching all Event Providers')
      const options = {
        fetchEventMetadata: flags.fetchEventMetadata,
        filterBy: {
          providerMetadataId: flags.providerMetadataId,
          instanceId: flags.instanceId,
          providerMetadataIds: flags.providerMetadataIds
        }
      }
      const providers = await this.eventClient.getAllProviders(this.conf.org.id, options)
      cli.action.stop()
      if (flags.json) {
        this.printJson(providers)
      } else if (flags.yml) {
        this.printYaml(providers)
      } else {
        this.printResults(providers._embedded.providers)
      }
    } catch (err) {
      aioLogger.debug(err)
      this.error(err)
    }
  }

  printResults (projects) {
    const columns = {
      id: {
        header: 'ID'
      },
      label: {
        header: 'LABEL'
      },
      description: {
        header: 'DESC'
      },
      source: {
        header: 'SOURCE'
      },
      docs_url: {
        header: 'DOCS'
      }
    }
    cli.table(projects, columns)
  }
}

ProviderListCommand.description = 'Get list of all Providers for the Organization'

ProviderListCommand.aliases = [
  'event:provider:ls'
]

ProviderListCommand.flags = {
  ...BaseCommand.flags,
  fetchEventMetadata: Flags.boolean({
    description: 'Fetch event metadata with provider'
  }),
  providerMetadataId: Flags.string({
    multiple: false,
    description: 'Filter providers for org by provider metadata id (and instance id if applicable)',
    exclusive: ['providerMetadataIds']
  }),
  instanceId: Flags.string({
    multiple: false,
    description: 'Filter providers for org by provider metadata id (and instance id if applicable)'
  }),
  providerMetadataIds: Flags.string({
    multiple: true,
    char: 'p',
    description: 'Filter providers for org by list of provider metadata ids',
    exclusive: ['providerMetadataId']
  }),
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

module.exports = ProviderListCommand
