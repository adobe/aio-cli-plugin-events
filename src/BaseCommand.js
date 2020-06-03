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

const { Command, flags } = require('@oclif/command')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events', { provider: 'debug' })
const aioConfig = require('@adobe/aio-lib-core-config')
const { getToken, context } = require('@adobe/aio-lib-ims')

const { EOL } = require('os')

const { CLI } = require('@adobe/aio-lib-ims/src/context')
const yaml = require('js-yaml')

const CONSOLE_CONFIG_KEY = '$console'
const CONSOLE_API_KEY = 'aio-cli-console-auth'

const EVENTS_CONFIG_KEY = '$events'

class BaseCommand extends Command {
  async initSdk () {
    // login
    await context.setCli({ '$cli.bare-output': true }, false) // set this globally
    aioLogger.debug('Retrieving Auth Token')
    this.accessToken = await getToken(CLI) // user access token, would work with jwt too

    // init console sdk
    this.consoleClient = await require('@adobe/aio-lib-console').init(this.accessToken, CONSOLE_API_KEY)

    // load configuration needed for future api calls
    aioLogger.debug('Loading config')
    this.conf = await this.loadConfig(this.consoleClient)

    // init the event client
    this.eventClient = await require('@adobe/aio-lib-events').init(this.conf.org.code, this.conf.integration.jwtClientId, this.accessToken)
  }

  /** @private */
  async loadConfig (consoleClient) {
    // are we in a local aio app project?
    const localProject = aioConfig.get('project', 'local')
    const localWorkspace = aioConfig.get('workspace', 'local')
    if (localProject && localProject.org && localWorkspace) {
      // is the above check enough?


      const workspaceIntegration = this.extractServiceIntegrationConfig(localWorkspace)
      // note in the local app aio, the workspaceIntegration only holds a reference, the
      // clientId is stored in the dotenv
      const integrationCredentials = aioConfig.get(workspaceIntegration.name, 'env')

      return {
        isLocal: true,
        org: { id: localProject.org.id, name: localProject.org.name, code: localProject.org.ims_org_id },
        project: { id: localProject.id, name: localProject.name, title: localProject.title },
        workspace: { id: localWorkspace.id, name: localWorkspace.name },
        integration: { id: workspaceIntegration.id, name: workspaceIntegration.name, jwtClientId: integrationCredentials.client_id }
      }
    }

    // use console config
    const { org, project, workspace } = aioConfig.get(CONSOLE_CONFIG_KEY) || {}
    if (!org || !project || !workspace ) {
      throw new Error(`Your console configuration is incomplete.${EOL}Use the 'aio console' commands to select your organization, project, and workspace.${EOL}${this.consoleConfigString().value}`)
    }
    let { integration, workspaceId } = aioConfig.get(EVENTS_CONFIG_KEY) || {}
    if (!integration || workspaceId !== workspace.id) {
      // fetch integration details
      const consoleJSON = await consoleClient.downloadWorkspaceJson(org.id, project.id, workspace.id)
      const workspaceIntegration = this.extractServiceIntegrationConfig(consoleJSON.body.project.workspace)
      integration = { id: workspaceIntegration.id, name: workspaceIntegration.name, jwtClientId: workspaceIntegration.jwt.client_id }

      // cache the integration details for future use
      aioConfig.set(EVENTS_CONFIG_KEY, { integration, workspaceId: workspace.id }, false)
    }
    return {
      isLocal: false,
      org, project, workspace, integration
    }
  }

  consoleConfigString (org = {}, project = {}, workspace = {}) {
    const list = [
      `1. Org: ${org.name || '<no org selected>'}`,
      `2. Project: ${project.name || '<no project selected>'}`,
      `3. Workspace: ${workspace.name || '<no workspace selected>'}`
    ]
    return { value: list.join(EOL) }
  }

  /** @private */
  extractServiceIntegrationConfig (workspaceConfig) {
    // note here we take the first that matches
    const workspaceIntegration = workspaceConfig.details.credentials && workspaceConfig.details.credentials.find(c => c.integration_type === "service")
    if (!workspaceIntegration) {
      throw new Error(`Workspace ${workspaceConfig.name} has no JWT integration`)
    }
    return workspaceIntegration
  }

  /**
   * Output JSON data
   *
   * @param {object} data JSON data to print
   */
  printJson (data) {
    this.log(JSON.stringify(data))
  }

  /**
   * Output YAML data
   *
   * @param {object} data YAML data to print
   */
  printYaml (data) {
    // clean undefined values
    data = JSON.parse(JSON.stringify(data))
    this.log(yaml.safeDump(data, { noCompatMode: true }))
  }
}

BaseCommand.flags = {
  verbose: flags.boolean({ char: 'v', description: 'Verbose output' }),
  version: flags.boolean({ description: 'Show version' })
}

module.exports = BaseCommand
