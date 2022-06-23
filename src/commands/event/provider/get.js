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
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:provider:get', { provider: 'debug' })

class ProviderGetCommand extends BaseCommand {
  async run () {
    const { args, flags } = await this.parse(ProviderGetCommand)

    try {
      await this.initSdk()
      cli.action.start('Fetching the Event Provider')
      const provider = await this.eventClient.getProvider(args.providerId,
        flags.fetchEventMetadata)
      cli.action.stop()

      if (flags.json) {
        this.printJson(provider)
      } else if (flags.yml) {
        this.printYaml(provider)
      } else {
        this.log(JSON.stringify(provider, null, 2))
      }
    } catch (err) {
      aioLogger.debug(err)
      this.error(err)
    }
  }
}

ProviderGetCommand.description = 'Get details of Provider by id'

ProviderGetCommand.args = [
  { name: 'providerId', required: true, description: 'The requested provider ID' }
]

ProviderGetCommand.flags = {
  ...BaseCommand.flags,
  fetchEventMetadata: Flags.boolean({
    description: 'Fetch event metadata with provider'
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

module.exports = ProviderGetCommand
