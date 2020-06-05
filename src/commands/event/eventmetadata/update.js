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
const inquirer = require('inquirer')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:provider:get', { provider: 'debug' })

class EventmetadataUpdateCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(EventmetadataUpdateCommand)
    try {
      await this.initSdk()
      const response = await inquirer.prompt([{
        name: 'label',
        message: 'Enter the label for the event metadata.',
        validate (input) {
          // eslint-disable-next-line no-useless-escape
          const valid = /[\w-_\.]{1,255}$/
          if (valid.test(input)) {
            return true
          }
          return `The input event metadata label '${input}' contains invalid character (valid characters are letters, numbers, underscores, hyphens, dots)"`
        }
      }, {
        name: 'description',
        message: 'Add a description about the event metadata.',
        validate (input) {
          // eslint-disable-next-line no-useless-escape
          const valid = /[\w\s-_\.\(\)\,\@]{1,255}$/
          if (valid.test(input)) {
            return true
          }
          return `The input event metadata's description '${input}' contains invalid character (valid characters are letters, numbers, underscores, hyphens, dots, parenthesis, comma, @ and space)"`
        }
      }])

      const eventMetadataPayload = {
        event_code: args.eventCode,
        label: response.label,
        description: response.description
      }

      const eventmetadata = await this.eventClient.updateEventMetadataForProvider(this.conf.org.id, this.conf.project.id, this.conf.workspace.id, args.providerId, args.eventCode, eventMetadataPayload)
      if (flags.json) {
        this.printJson(eventmetadata)
      } else if (flags.yml) {
        this.printYaml(eventmetadata)
      } else {
        this.log(JSON.stringify(eventmetadata, null, 2))
      }
    } catch (err) {
      cli.action.stop()
      aioLogger.debug(err)
      this.error(err.message)
    } finally {
      cli.action.stop()
    }
  }
}

EventmetadataUpdateCommand.description = 'Update an event metadata for a provider'

EventmetadataUpdateCommand.args = [
  { name: 'providerId', required: true },
  { name: 'eventCode', required: true }
]

EventmetadataUpdateCommand.flags = {
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

module.exports = EventmetadataUpdateCommand
