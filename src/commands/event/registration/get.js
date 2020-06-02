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

class GetCommand extends BaseCommand {
  async run () {
    const { args } = this.parse(GetCommand)

    await this.initSdk()
    // todo formatting + support of --json and --yml
    const res = await this.eventClient.getWebhookRegistration(this.conf.org.id, this.conf.integration.id, args.registrationId)
    this.log(res)
  }
}

GetCommand.args = [
  { name: 'registrationId', required: true }
]

GetCommand.flags = {
  ...BaseCommand.flags
}

module.exports = GetCommand
