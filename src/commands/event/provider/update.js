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

class ProviderUpdateCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(ProviderUpdateCommand)
    try {
      await this.initSdk()
      const response = await inquirer.prompt([{
        name: 'label',
        message: 'Enter the label for the provider',
        validate (input) {
          // eslint-disable-next-line no-useless-escape
          const valid = /[\w\s-_\.\(\)\,\@]{1,255}$/
          if (valid.test(input)) {
            return true
          }
          return `The input provider's label '${input}' contains invalid character (valid characters are letters, numbers, underscores, hyphens, dots, parenthesis, comma, @ and space)"`
        }
      }, {
        name: 'description',
        message: 'Add a description about the provider. (Optional)',
        validate (input) {
          // eslint-disable-next-line no-useless-escape
          const valid = /[\w\s-_\.\(\)\,\@]{0,255}$/
          if (valid.test(input)) {
            return true
          }
          return `The input provider's description '${input}' contains invalid character (valid characters are letters, numbers, underscores, hyphens, dots, parenthesis, comma, @ and space)"`
        }
      }, {
        name: 'docs_url',
        message: 'Add a url that contains documentation about the provider. (Optional)'
      }])

      const providerPayload = {
        label: response.label,
        description: response.description || undefined,
        docs_url: response.docs_url || undefined
      }

      cli.action.start('Updating the Event Provider')
      const provider = await this.eventClient.updateProvider(this.conf.org.id, this.conf.project.id, this.conf.workspace.id, args.providerId, providerPayload)
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

ProviderUpdateCommand.description = 'Update an existing provider'

ProviderUpdateCommand.args = [
  { name: 'providerId', required: true }
]

ProviderUpdateCommand.flags = {
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

module.exports = ProviderUpdateCommand
