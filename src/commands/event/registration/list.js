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

const BaseCommand = require('../../../BaseCommand')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:registration:list', { provider: 'debug' })

class ListCommand extends BaseCommand {
  async run () {
    const { flags } = this.parse(ListCommand)

    try {
      await this.initSdk()
      aioLogger.debug('Listing Registrations')

      cli.action.start(`Retrieving Registrations for the Workspace ${this.conf.workspace.id}`)
      const registrations = await this.eventClient.getAllWebhookRegistrations(this.conf.org.id, this.conf.integration.id)
      cli.action.stop()

      aioLogger.debug('Listing Registrations: Data Received')

      if (flags.json) {
        this.printJson(registrations)
      } else if (flags.yml) {
        this.printYaml(registrations)
      } else {
        // print formatted result
        const commonTableConfig = { minWidth: 25 }
        cli.table(registrations, {
          registration_id: commonTableConfig,
          name: commonTableConfig,
          // description: commonTableConfig, to
          integration_status: commonTableConfig,
          delivery_type: commonTableConfig
        }, {
          printLine: this.log
        })
      }
    } catch (err) {
      cli.action.stop()
      aioLogger.debug(err)
      this.error(err.message)
    }
  }
}

ListCommand.description = 'List your Registrations in your current Workspace'

ListCommand.aliases = [
  'console:registration:ls',
  'console:registration:list',
  'console:reg:ls'
]

ListCommand.flags = {
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

module.exports = ListCommand
