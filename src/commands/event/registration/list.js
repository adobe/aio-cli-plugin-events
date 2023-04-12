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

const BaseCommand = require('../../../BaseCommand')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:registration:list', { provider: 'debug' })

class ListCommand extends BaseCommand {
  async run () {
    const { flags } = await this.parse(ListCommand)

    try {
      await this.initSdk()

      aioLogger.debug(`list registrations in the workspace ${this.conf.workspace.id}`)
      cli.action.start(`Retrieving Registrations for the Workspace ${this.conf.workspace.id}`)
      const registrationHalModel = await this.eventClient.getAllRegistrationsForWorkspace(this.conf.org.id, this.conf.project.id, this.conf.workspace.id)
      cli.action.stop()
      aioLogger.debug(`list successful, got ${registrationHalModel._embedded.registrations.length} elements with ids: ${registrationHalModel._embedded.registrations.map(r => r.id)}`)
      if (flags.json) {
        this.printJson(registrationHalModel)
      } else if (flags.yml) {
        this.printYaml(registrationHalModel)
      } else {
        // print formatted result
        cli.table(registrationHalModel._embedded.registrations, {
          registration_id: { minWidth: 38, header: 'ID' },
          name: { minWidth: 25, header: 'NAME' },
          enabled: { minWidth: 10, header: 'ENABLED' },
          delivery_type: { minWidth: 10, header: 'DELIVERY_TYPE' },
          webhook_status: { minWidth: 10, header: 'WEBHOOK_STATUS' }
        }, {
          printLine: this.log.bind(this)
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
  'event:registration:ls',
  'event:reg:list',
  'event:reg:ls'
]

ListCommand.flags = {
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

module.exports = ListCommand
