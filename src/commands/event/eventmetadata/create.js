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
const { sentenceValidatorWithMinOneChar, eventCodeValidator } = require('../../../utils/validator')
const inquirer = require('inquirer')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:eventmetadata:create', { provider: 'debug' })

class EventmetadataCreateCommand extends BaseCommand {
  async run () {
    const { args, flags } = await this.parse(EventmetadataCreateCommand)
    try {
      await this.initSdk()
      const response = await inquirer.prompt([{
        name: 'label',
        message: 'Enter the label for the event metadata.',
        validate: sentenceValidatorWithMinOneChar
      }, {
        name: 'event_code',
        message: 'Enter the event code that is used as part of the message in reverse dns format ( eg. com.adobe.eventcode).',
        validate: eventCodeValidator
      }, {
        name: 'description',
        message: 'Add a description about the event metadata.',
        validate: sentenceValidatorWithMinOneChar
      }])

      const eventMetadataPayload = {
        event_code: response.event_code,
        label: response.label,
        description: response.description
      }

      cli.action.start('Creating Event Metadata')
      const eventmetadata = await this.eventClient.createEventMetadataForProvider(this.conf.org.id, this.conf.project.id, this.conf.workspace.id, args.providerId, eventMetadataPayload)
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

EventmetadataCreateCommand.description = 'Create an Event Metadata for a Provider'

EventmetadataCreateCommand.args = [
  { name: 'providerId', required: true, description: 'The requested eventmetadata event code' }
]

EventmetadataCreateCommand.flags = {
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

module.exports = EventmetadataCreateCommand
