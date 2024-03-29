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
const { CliUx: { ux: cli } } = require('@oclif/core')
const inquirer = require('inquirer')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:eventmetadata:delete', { provider: 'debug' })

class EventmetadataDeleteCommand extends BaseCommand {
  async run () {
    const { args } = await this.parse(EventmetadataDeleteCommand)

    try {
      await this.initSdk()
      if (!args.eventCode) {
        const response = await inquirer.prompt([{
          type: 'confirm',
          name: 'delete',
          message: 'Are you sure you want to delete all event metadata? This operation is irreversible.'

        }])
        if (response.delete) {
          cli.action.start('Deleting ALL Event Metadata for provider')
          await this.eventClient.deleteAllEventMetadata(this.conf.org.id,
            this.conf.project.id, this.conf.workspace.id, args.providerId)
          cli.action.stop()
          this.log('All event metadata of provider ' + args.providerId + ' has been deleted successfully')
        } else {
          this.log('Deletion operation has been cancelled. For more information on delete use --help')
        }
      } else {
        const response = await inquirer.prompt([{
          type: 'confirm',
          name: 'delete',
          message: 'Are you sure you want to delete ' + args.eventCode + '? This operation is irreversible.'

        }])
        if (response.delete) {
          cli.action.start('Deleting Event Metadata for provider')
          await this.eventClient.deleteEventMetadata(this.conf.org.id,
            this.conf.project.id, this.conf.workspace.id, args.providerId,
            args.eventCode)
          cli.action.stop()
          this.log(args.eventCode + ' event metadata of provider ' + args.providerId + ' has been deleted successfully')
        } else {
          this.log('Deletion operation has been cancelled. For more information on delete use --help')
        }
      }
    } catch (err) {
      aioLogger.debug(err)
      this.error(err)
    }
  }
}

EventmetadataDeleteCommand.description = 'Delete Event Metadata for a Provider'

EventmetadataDeleteCommand.args = [
  { name: 'providerId', required: true, description: 'The requested provider ID' },
  { name: 'eventCode', required: false, description: 'The requested eventmetadata event code' }
]

EventmetadataDeleteCommand.flags = {
  ...BaseCommand.flags
}

module.exports = EventmetadataDeleteCommand
