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

const { Command, Flags } = require('@oclif/core')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events', { provider: 'debug' })
const aioConfig = require('@adobe/aio-lib-core-config')
const { getToken, context } = require('@adobe/aio-lib-ims')
const { EOL } = require('os')

const { CLI } = require('@adobe/aio-lib-ims/src/context')
const yaml = require('js-yaml')

const Events = require('@adobe/aio-lib-events')
const Console = require('@adobe/aio-lib-console')

const CONSOLE_CONFIG_KEY = 'console'
const CONSOLE_API_KEY = 'aio-cli-console-auth'
const EVENTS_CONFIG_KEY = 'events'
const JWT_INTEGRATION_TYPE = 'service'
const JWT_JSON_KEY = 'jwt'
const OAUTH_SERVER_TO_SERVER_INTEGRATION_TYPE = 'oauth_server_to_server'
const OAUTH_SERVER_TO_SERVER_MIGRATE_INTEGRATION_TYPE = 'oauth_server_to_server_migrate'
const INTEGRATION_TYPES_TO_JSON_KEYS_MAP = {
  [OAUTH_SERVER_TO_SERVER_INTEGRATION_TYPE]: OAUTH_SERVER_TO_SERVER_INTEGRATION_TYPE,
  [OAUTH_SERVER_TO_SERVER_MIGRATE_INTEGRATION_TYPE]: OAUTH_SERVER_TO_SERVER_INTEGRATION_TYPE,
  [JWT_INTEGRATION_TYPE]: JWT_JSON_KEY
}

class BaseCommand extends Command {
  async initSdk () {
    // login
    await context.setCli({ 'cli.bare-output': true }, false) // set this globally
    aioLogger.debug('run login')
    this.accessToken = await getToken(CLI) // user access token, would work with JWT/OAuth Server-to-Server token too

    // init console sdk
    this.consoleClient = await Console.init(this.accessToken, CONSOLE_API_KEY)

    // load configuration needed for future api calls
    aioLogger.debug('loading console configuration')
    this.conf = await this.loadConfig(this.consoleClient)

    aioLogger.debug(`${JSON.stringify(this.conf)}`)

    // init the event client
    aioLogger.debug(`initializing aio-lib-events with org=${this.conf.org.code}, apiKey(clientId)=${this.conf.integration.clientId} and accessToken=<hidden>`)
    this.eventClient = await Events.init(this.conf.org.code, this.conf.integration.clientId, this.accessToken)
  }

  // Note: loadConfig should be shared across plugins at the aio-lib-ims level
  // see: https://github.com/adobe/aio-cli-plugin-console/issues/149
  /** @private */
  async loadConfig (consoleClient) {
    // are we in a local aio app project?
    const localProject = aioConfig.get('project', 'local')
    if (localProject && localProject.org && localProject.workspace) {
      // is the above check enough?
      aioLogger.debug('retrieving console configuration from local aio application config')
      const workspaceIntegration = this.extractServiceIntegrationConfig(localProject.workspace)
      // note in the local app aio, the workspaceIntegration only holds a reference, the
      // clientId is stored in the dotenv
      aioLogger.debug(`loading local IMS context ${workspaceIntegration.name}`)
      const integrationCredentials = (await context.get(workspaceIntegration.name)).data
      if (!integrationCredentials || !integrationCredentials.client_id) {
        throw new Error(`IMS configuration for ${workspaceIntegration.name} is incomplete or missing`)
      }

      return {
        isLocal: true,
        org: { id: localProject.org.id, name: localProject.org.name, code: localProject.org.ims_org_id },
        project: { id: localProject.id, name: localProject.name, title: localProject.title },
        workspace: { id: localProject.workspace.id, name: localProject.workspace.name },
        integration: { id: workspaceIntegration.id, name: workspaceIntegration.name, clientId: integrationCredentials.client_id }
      }
    }

    // use global console config
    aioLogger.debug('retrieving console configuration from global config')
    const { org, project, workspace } = aioConfig.get(CONSOLE_CONFIG_KEY) || {}
    if (!org || !project || !workspace) {
      throw new Error(`Your console configuration is incomplete.${EOL}Use the 'aio console' commands to select your organization, project, and workspace.${EOL}${this.consoleConfigString(org, project, workspace).value}`)
    }
    let { integration, workspaceId } = aioConfig.get(EVENTS_CONFIG_KEY) || {}
    if (integration) {
      aioLogger.debug(`found integration in ${EVENTS_CONFIG_KEY} cache with workspaceId=${workspaceId}`)
      if (workspaceId !== workspace.id) {
        aioLogger.debug(`cannot use cache as workspaceId does not match selected workspace: ${workspace.id}`)
      }
    }
    if (!integration || workspaceId !== workspace.id) {
      aioLogger.debug('downloading workspace JSON to retrieve integration details')
      // fetch integration details
      const consoleJSON = await consoleClient.downloadWorkspaceJson(org.id, project.id, workspace.id)
      const workspaceIntegration = this.extractServiceIntegrationConfig(consoleJSON.body.project.workspace)
      const integrationType = workspaceIntegration.integration_type
      const credentialJsonKey = INTEGRATION_TYPES_TO_JSON_KEYS_MAP[integrationType]
      integration = {
        id: workspaceIntegration.id,
        name: workspaceIntegration.name,
        clientId: workspaceIntegration[credentialJsonKey].client_id
      }

      // cache the integration details for future use
      aioLogger.debug(`caching integration details with workspaceId=${workspace.id} to ${EVENTS_CONFIG_KEY}`)
      aioConfig.set(EVENTS_CONFIG_KEY, { integration, workspaceId: workspace.id }, false)
    }
    return {
      isLocal: false,
      org,
      project: { id: project.id, name: project.name, title: project.title },
      workspace,
      integration
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
    const workspaceIntegration = workspaceConfig.details.credentials &&
        workspaceConfig.details.credentials.find(c => {
          return Object.keys(INTEGRATION_TYPES_TO_JSON_KEYS_MAP)
            .includes(c.integration_type)
        })
    if (!workspaceIntegration) {
      throw new Error(this.getErrorMessageForInvalidCredentials(workspaceConfig.name))
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

  /**
   * Returns error message for invalid credential configuration in a workspace
   *
   * @param {string} workspaceName - name of the workspace
   * @returns {string} error message in case the workspace has invalid credential configuration
   */
  getErrorMessageForInvalidCredentials (workspaceName) {
    return `Workspace ${workspaceName} has no oAuth Server-to-Server or JWT credential associated.`
  }
}

BaseCommand.flags = {
  help: Flags.boolean({ description: 'Show help' }),
  verbose: Flags.boolean({ char: 'v', description: 'Verbose output' }),
  version: Flags.boolean({ description: 'Show version' })
}

module.exports = BaseCommand
