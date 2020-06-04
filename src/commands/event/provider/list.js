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
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:provider:get', { provider: 'debug' })

class ProviderListCommand extends BaseCommand {
  async run () {
    const { flags } = this.parse(ProviderListCommand)
    try {
      await this.initSdk()
      const providers = await this.eventClient.getAllProviders(this.conf.org.id)

      if (flags.json) {
        this.printJson(providers)
      } else if (flags.yml) {
        this.printYaml(providers)
      } else {
        this.printResults(providers._embedded.providers)
      }
    } catch (err) {
      cli.action.stop()
      aioLogger.debug(err)
      this.error(err.message)
    } finally {
      cli.action.stop()
    }
    await this.initSdk()
  }

  printResults (projects) {
    const columns = {
      id: {
        header: 'ID'
      },
      label: {
        header: 'NAME'
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

ProviderListCommand.flags = {
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

module.exports = ProviderListCommand
