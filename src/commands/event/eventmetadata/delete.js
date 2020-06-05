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
const { cli } = require('cli-ux')
const inquirer = require('inquirer')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:provider:get', { provider: 'debug' })

class EventmetadataDeleteCommand extends BaseCommand {
  async run () {
    const { args } = this.parse(EventmetadataDeleteCommand)

    try {
      await this.initSdk()
      if (args.eventCode === undefined) {
        const response = await inquirer.prompt([{
          type: 'confirm',
          name: 'delete',
          message: 'Are you sure you want to delete all event metadata?'

        }])
        if (response.delete) {
          await this.eventClient.deleteAllEventMetadata(this.conf.org.id,
            this.conf.project.id, this.conf.workspace.id, args.providerId)
          this.log('All eventmetadata of provider ' + args.providerId + ' has been deleted successfully')
        } else {
          this.log('Deletion operation has been cancelled. For more information on delete use --help')
        }
      } else {
        const response = await inquirer.prompt([{
          type: 'confirm',
          name: 'delete',
          message: 'Are you sure you want to delete ' + args.eventCode + '?'

        }])
        if (response.delete) {
          await this.eventClient.deleteEventMetadata(this.conf.org.id,
            this.conf.project.id, this.conf.workspace.id, args.providerId,
            args.eventCode)
          this.log(args.eventCode + ' eventmetadata of provider ' + args.providerId + ' has been deleted successfully')
        } else {
          this.log('Deletion operation has been cancelled. For more information on delete use --help')
        }
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

EventmetadataDeleteCommand.description = 'Delete event metadata for a provider'

EventmetadataDeleteCommand.args = [
  { name: 'providerId', required: true },
  { name: 'eventCode', required: false }
]

EventmetadataDeleteCommand.flags = {
  ...BaseCommand.flag
}

module.exports = EventmetadataDeleteCommand
