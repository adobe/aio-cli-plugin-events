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
const { sentenceValidatorWithMinOneChar, sentenceValidatorWithMinZeroChar } = require('../../../utils/validator')
const inquirer = require('inquirer')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:provider:create', { provider: 'debug' })

class ProviderCreateCommand extends BaseCommand {
  async run () {
    const { flags } = await this.parse(ProviderCreateCommand)
    try {
      await this.initSdk()
      const response = await inquirer.prompt([{
        name: 'label',
        message: 'Enter the label for the provider.',
        validate: sentenceValidatorWithMinOneChar
      }, {
        name: 'description',
        message: 'Add a description about the provider. (Optional)',
        validate: sentenceValidatorWithMinZeroChar
      }, {
        name: 'docs_url',
        message: 'Add a url that contains documentation about the provider. (Optional)'
      }])

      const providerPayload = {
        label: response.label,
        description: response.description || undefined,
        docs_url: response.docs_url || undefined
      }

      cli.action.start('Creating Event Provider')
      const provider = await this.eventClient.createProvider(this.conf.org.id, this.conf.project.id, this.conf.workspace.id, providerPayload)
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

ProviderCreateCommand.description = 'Create a new Provider'

ProviderCreateCommand.flags = {
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

module.exports = ProviderCreateCommand
