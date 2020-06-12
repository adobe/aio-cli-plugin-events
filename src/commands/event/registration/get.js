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
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:registration:get', { provider: 'debug' })

class GetCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(GetCommand)

    try {
      await this.initSdk()

      aioLogger.debug(`get registration: ${args.registrationId}`)
      cli.action.start(`Retrieving Registration with id ${args.registrationId}`)
      const registration = await this.eventClient.getWebhookRegistration(this.conf.org.id, this.conf.integration.id, args.registrationId)
      cli.action.stop()
      aioLogger.debug(`get successful, name: ${registration.name}`)

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
}

GetCommand.description = 'Get an Event Registration in your Workspace'

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
  { name: 'registrationId', required: true, description: 'the Events Registration id' }
]

module.exports = GetCommand
