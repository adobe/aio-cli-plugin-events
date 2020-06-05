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

      aioLogger.debug(`list registrations in the workspace ${this.conf.workspace.id}`)
      cli.action.start(`Retrieving Registrations for the Workspace ${this.conf.workspace.id}`)
      const registrations = await this.eventClient.getAllWebhookRegistrations(this.conf.org.id, this.conf.integration.id)
      cli.action.stop()
      aioLogger.debug(`list successful, got ${registrations.length} elements with ids: ${registrations.map(r => r.id)}`)

      if (flags.json) {
        this.printJson(registrations)
      } else if (flags.yml) {
        this.printYaml(registrations)
      } else {
        // print formatted result
        cli.table(registrations, {
          registration_id: { minWidth: 38, header: 'ID' },
          name: { minWidth: 25, header: 'NAME' },
          integration_status: { minWidth: 10, header: 'INTEGRATION_STATUS' },
          delivery_type: { minWidth: 10, header: 'DELIVERY_TYPE' },
          status: { minWidth: 10, header: 'STATUS' }
        }, {
          printLine: this.log
        })
      }
    } catch (err) {
      aioLogger.debug(err)
      this.error(err)
    }
  }
}

ListCommand.description = 'List your Event Registrations in your Workspace'

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
