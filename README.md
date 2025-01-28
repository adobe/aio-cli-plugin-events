<!--
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@adobe/aio-cli-plugin-events.svg)](https://npmjs.org/package/@adobe/aio-cli-plugin-events)
[![Downloads/week](https://img.shields.io/npm/dw/@adobe/aio-cli-plugin-events.svg)](https://npmjs.org/package/@adobe/aio-cli-plugin-events)
[![Build Status](https://travis-ci.com/adobe/aio-cli-plugin-events.svg?branch=master)](https://travis-ci.com/adobe/aio-cli-plugin-events)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) 
[![Codecov Coverage](https://img.shields.io/codecov/c/github/adobe/aio-cli-plugin-events/master.svg?style=flat-square)](https://codecov.io/gh/adobe/aio-cli-plugin-events/)
[![pre-release version](https://img.shields.io/npm/v/@adobe/aio-cli-plugin-events/next.svg)](https://npmjs.org/package/@adobe/aio-cli-plugin-events/v/next)

# Adobe I/O Events CLI Plugin

Adobe I/O Events Plugin for the Adobe I/O CLI

<!-- toc -->
* [Adobe I/O Events CLI Plugin](#adobe-io-events-cli-plugin)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage
```sh-session
$ aio plugins:install -g @adobe/aio-cli-plugin-events
$ # OR
$ aio discover -i
$ aio event --help
```

# Commands
<!-- commands -->
* [`aio event`](#aio-event)
* [`aio event eventmetadata`](#aio-event-eventmetadata)
* [`aio event eventmetadata create PROVIDERID`](#aio-event-eventmetadata-create-providerid)
* [`aio event eventmetadata delete PROVIDERID [EVENTCODE]`](#aio-event-eventmetadata-delete-providerid-eventcode)
* [`aio event eventmetadata get PROVIDERID EVENTCODE`](#aio-event-eventmetadata-get-providerid-eventcode)
* [`aio event eventmetadata list PROVIDERID`](#aio-event-eventmetadata-list-providerid)
* [`aio event eventmetadata ls PROVIDERID`](#aio-event-eventmetadata-ls-providerid)
* [`aio event eventmetadata update PROVIDERID EVENTCODE`](#aio-event-eventmetadata-update-providerid-eventcode)
* [`aio event provider`](#aio-event-provider)
* [`aio event provider create`](#aio-event-provider-create)
* [`aio event provider delete PROVIDERID`](#aio-event-provider-delete-providerid)
* [`aio event provider get PROVIDERID`](#aio-event-provider-get-providerid)
* [`aio event provider list`](#aio-event-provider-list)
* [`aio event provider ls`](#aio-event-provider-ls)
* [`aio event provider update PROVIDERID`](#aio-event-provider-update-providerid)
* [`aio event reg`](#aio-event-reg)
* [`aio event reg create BODYJSONFILE`](#aio-event-reg-create-bodyjsonfile)
* [`aio event reg delete REGISTRATIONID`](#aio-event-reg-delete-registrationid)
* [`aio event reg get REGISTRATIONID`](#aio-event-reg-get-registrationid)
* [`aio event reg list`](#aio-event-reg-list)
* [`aio event reg ls`](#aio-event-reg-ls)
* [`aio event registration`](#aio-event-registration)
* [`aio event registration create BODYJSONFILE`](#aio-event-registration-create-bodyjsonfile)
* [`aio event registration delete REGISTRATIONID`](#aio-event-registration-delete-registrationid)
* [`aio event registration get REGISTRATIONID`](#aio-event-registration-get-registrationid)
* [`aio event registration list`](#aio-event-registration-list)
* [`aio event registration ls`](#aio-event-registration-ls)

## `aio event`

Manage your Adobe I/O Events

```
USAGE
  $ aio event [--help] [-v] [--version]

FLAGS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version

DESCRIPTION
  Manage your Adobe I/O Events
```

_See code: [src/commands/event/index.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/index.js)_

## `aio event eventmetadata`

Manage your Adobe I/O Events Providers' Event Metadata

```
USAGE
  $ aio event eventmetadata [--help] [-v] [--version]

FLAGS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version

DESCRIPTION
  Manage your Adobe I/O Events Providers' Event Metadata
```

_See code: [src/commands/event/eventmetadata/index.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/eventmetadata/index.js)_

## `aio event eventmetadata create PROVIDERID`

Create an Event Metadata for a Provider

```
USAGE
  $ aio event eventmetadata create PROVIDERID [--help] [-v] [--version] [-j | -y]

ARGUMENTS
  PROVIDERID  The requested eventmetadata event code

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  Create an Event Metadata for a Provider
```

_See code: [src/commands/event/eventmetadata/create.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/eventmetadata/create.js)_

## `aio event eventmetadata delete PROVIDERID [EVENTCODE]`

Delete Event Metadata for a Provider

```
USAGE
  $ aio event eventmetadata delete PROVIDERID [EVENTCODE] [--help] [-v] [--version]

ARGUMENTS
  PROVIDERID  The requested provider ID
  EVENTCODE   The requested eventmetadata event code

FLAGS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version

DESCRIPTION
  Delete Event Metadata for a Provider
```

_See code: [src/commands/event/eventmetadata/delete.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/eventmetadata/delete.js)_

## `aio event eventmetadata get PROVIDERID EVENTCODE`

Get details of an Event Code of a Provider

```
USAGE
  $ aio event eventmetadata get PROVIDERID EVENTCODE [--help] [-v] [--version] [-j | -y]

ARGUMENTS
  PROVIDERID  The requested provider ID
  EVENTCODE   The requested eventmetadata event code

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  Get details of an Event Code of a Provider
```

_See code: [src/commands/event/eventmetadata/get.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/eventmetadata/get.js)_

## `aio event eventmetadata list PROVIDERID`

List all Event Metadata for a Provider

```
USAGE
  $ aio event eventmetadata list PROVIDERID [--help] [-v] [--version] [-j | -y]

ARGUMENTS
  PROVIDERID  The requested provider ID

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  List all Event Metadata for a Provider

ALIASES
  $ aio event eventmetadata ls
```

_See code: [src/commands/event/eventmetadata/list.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/eventmetadata/list.js)_

## `aio event eventmetadata ls PROVIDERID`

List all Event Metadata for a Provider

```
USAGE
  $ aio event eventmetadata ls PROVIDERID [--help] [-v] [--version] [-j | -y]

ARGUMENTS
  PROVIDERID  The requested provider ID

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  List all Event Metadata for a Provider

ALIASES
  $ aio event eventmetadata ls
```

## `aio event eventmetadata update PROVIDERID EVENTCODE`

Update an Event Metadata for a Provider

```
USAGE
  $ aio event eventmetadata update PROVIDERID EVENTCODE [--help] [-v] [--version] [-j | -y]

ARGUMENTS
  PROVIDERID  The requested provider ID
  EVENTCODE   The requested eventmetadata event code

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  Update an Event Metadata for a Provider
```

_See code: [src/commands/event/eventmetadata/update.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/eventmetadata/update.js)_

## `aio event provider`

Manage your Adobe I/O Events Providers

```
USAGE
  $ aio event provider [--help] [-v] [--version]

FLAGS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version

DESCRIPTION
  Manage your Adobe I/O Events Providers
```

_See code: [src/commands/event/provider/index.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/provider/index.js)_

## `aio event provider create`

Create a new Provider

```
USAGE
  $ aio event provider create [--help] [-v] [--version] [-j | -y]

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  Create a new Provider
```

_See code: [src/commands/event/provider/create.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/provider/create.js)_

## `aio event provider delete PROVIDERID`

Delete Provider by id

```
USAGE
  $ aio event provider delete PROVIDERID [--help] [-v] [--version]

ARGUMENTS
  PROVIDERID  The requested provider ID

FLAGS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version

DESCRIPTION
  Delete Provider by id
```

_See code: [src/commands/event/provider/delete.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/provider/delete.js)_

## `aio event provider get PROVIDERID`

Get details of Provider by id

```
USAGE
  $ aio event provider get PROVIDERID [--help] [-v] [--version] [--fetchEventMetadata] [-j | -y]

ARGUMENTS
  PROVIDERID  The requested provider ID

FLAGS
  -j, --json            Output json
  -v, --verbose         Verbose output
  -y, --yml             Output yml
  --fetchEventMetadata  Fetch event metadata with provider
  --help                Show help
  --version             Show version

DESCRIPTION
  Get details of Provider by id
```

_See code: [src/commands/event/provider/get.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/provider/get.js)_

## `aio event provider list`

Get list of all Providers for the Organization

```
USAGE
  $ aio event provider list [--help] [-v] [--version] [--fetchEventMetadata] [--providerMetadataId <value> | -p <value>]
    [--instanceId <value>] [-j | -y]

FLAGS
  -j, --json                            Output json
  -p, --providerMetadataIds=<value>...  Filter providers for org by list of provider metadata ids
  -v, --verbose                         Verbose output
  -y, --yml                             Output yml
  --fetchEventMetadata                  Fetch event metadata with provider
  --help                                Show help
  --instanceId=<value>                  Filter providers for org by provider metadata id (and instance id if applicable)
  --providerMetadataId=<value>          Filter providers for org by provider metadata id (and instance id if applicable)
  --version                             Show version

DESCRIPTION
  Get list of all Providers for the Organization

ALIASES
  $ aio event provider ls
```

_See code: [src/commands/event/provider/list.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/provider/list.js)_

## `aio event provider ls`

Get list of all Providers for the Organization

```
USAGE
  $ aio event provider ls [--help] [-v] [--version] [--fetchEventMetadata] [--providerMetadataId <value> | -p <value>]
    [--instanceId <value>] [-j | -y]

FLAGS
  -j, --json                            Output json
  -p, --providerMetadataIds=<value>...  Filter providers for org by list of provider metadata ids
  -v, --verbose                         Verbose output
  -y, --yml                             Output yml
  --fetchEventMetadata                  Fetch event metadata with provider
  --help                                Show help
  --instanceId=<value>                  Filter providers for org by provider metadata id (and instance id if applicable)
  --providerMetadataId=<value>          Filter providers for org by provider metadata id (and instance id if applicable)
  --version                             Show version

DESCRIPTION
  Get list of all Providers for the Organization

ALIASES
  $ aio event provider ls
```

## `aio event provider update PROVIDERID`

Update an existing Provider

```
USAGE
  $ aio event provider update PROVIDERID [--help] [-v] [--version] [-j | -y]

ARGUMENTS
  PROVIDERID  The requested provider ID

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  Update an existing Provider
```

_See code: [src/commands/event/provider/update.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/provider/update.js)_

## `aio event reg`

Manage your Adobe I/O Events Registrations

```
USAGE
  $ aio event reg [--help] [-v] [--version]

FLAGS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version

DESCRIPTION
  Manage your Adobe I/O Events Registrations

ALIASES
  $ aio event reg
```

## `aio event reg create BODYJSONFILE`

Create a new Event Registration in your Workspace

```
USAGE
  $ aio event reg create BODYJSONFILE [--help] [-v] [--version] [-j | -y]

ARGUMENTS
  BODYJSONFILE
      Path to a file in JSON format with the information to create a new Event Registration.
      The JSON should follow the following format:
      {
      "name": "<event registration name>",
      "description": "<event registration description>",
      "delivery_type": "webhook|webhook_batch|journal",
      "webhook_url": "<webhook URL responding to challenge>",
      "events_of_interest": [{
      "provider_id": "<event provider id>",
      "event_code": "<event provider event_code metadata>"
      }, { /* ...more events */ }]
      }

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  Create a new Event Registration in your Workspace

ALIASES
  $ aio event reg create
```

## `aio event reg delete REGISTRATIONID`

Delete Registration

```
USAGE
  $ aio event reg delete REGISTRATIONID [--help] [-v] [--version]

ARGUMENTS
  REGISTRATIONID  The requested registration ID

FLAGS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version

DESCRIPTION
  Delete Registration

ALIASES
  $ aio event reg delete
```

## `aio event reg get REGISTRATIONID`

Get an Event Registration in your Workspace

```
USAGE
  $ aio event reg get REGISTRATIONID [--help] [-v] [--version] [-j | -y]

ARGUMENTS
  REGISTRATIONID  The requested registration ID

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  Get an Event Registration in your Workspace

ALIASES
  $ aio event reg get
```

## `aio event reg list`

List your Event Registrations in your Workspace

```
USAGE
  $ aio event reg list [--help] [-v] [--version] [-j | -y]

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  List your Event Registrations in your Workspace

ALIASES
  $ aio event registration ls
  $ aio event reg list
  $ aio event reg ls
```

## `aio event reg ls`

List your Event Registrations in your Workspace

```
USAGE
  $ aio event reg ls [--help] [-v] [--version] [-j | -y]

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  List your Event Registrations in your Workspace

ALIASES
  $ aio event registration ls
  $ aio event reg list
  $ aio event reg ls
```

## `aio event registration`

Manage your Adobe I/O Events Registrations

```
USAGE
  $ aio event registration [--help] [-v] [--version]

FLAGS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version

DESCRIPTION
  Manage your Adobe I/O Events Registrations

ALIASES
  $ aio event reg
```

_See code: [src/commands/event/registration/index.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/registration/index.js)_

## `aio event registration create BODYJSONFILE`

Create a new Event Registration in your Workspace

```
USAGE
  $ aio event registration create BODYJSONFILE [--help] [-v] [--version] [-j | -y]

ARGUMENTS
  BODYJSONFILE
      Path to a file in JSON format with the information to create a new Event Registration.
      The JSON should follow the following format:
      {
      "name": "<event registration name>",
      "description": "<event registration description>",
      "delivery_type": "webhook|webhook_batch|journal",
      "webhook_url": "<webhook URL responding to challenge>",
      "events_of_interest": [{
      "provider_id": "<event provider id>",
      "event_code": "<event provider event_code metadata>"
      }, { /* ...more events */ }]
      }

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  Create a new Event Registration in your Workspace

ALIASES
  $ aio event reg create
```

_See code: [src/commands/event/registration/create.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/registration/create.js)_

## `aio event registration delete REGISTRATIONID`

Delete Registration

```
USAGE
  $ aio event registration delete REGISTRATIONID [--help] [-v] [--version]

ARGUMENTS
  REGISTRATIONID  The requested registration ID

FLAGS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version

DESCRIPTION
  Delete Registration

ALIASES
  $ aio event reg delete
```

_See code: [src/commands/event/registration/delete.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/registration/delete.js)_

## `aio event registration get REGISTRATIONID`

Get an Event Registration in your Workspace

```
USAGE
  $ aio event registration get REGISTRATIONID [--help] [-v] [--version] [-j | -y]

ARGUMENTS
  REGISTRATIONID  The requested registration ID

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  Get an Event Registration in your Workspace

ALIASES
  $ aio event reg get
```

_See code: [src/commands/event/registration/get.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/registration/get.js)_

## `aio event registration list`

List your Event Registrations in your Workspace

```
USAGE
  $ aio event registration list [--help] [-v] [--version] [-j | -y]

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  List your Event Registrations in your Workspace

ALIASES
  $ aio event registration ls
  $ aio event reg list
  $ aio event reg ls
```

_See code: [src/commands/event/registration/list.js](https://github.com/adobe/aio-cli-plugin-events/blob/v4.0.1/src/commands/event/registration/list.js)_

## `aio event registration ls`

List your Event Registrations in your Workspace

```
USAGE
  $ aio event registration ls [--help] [-v] [--version] [-j | -y]

FLAGS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

DESCRIPTION
  List your Event Registrations in your Workspace

ALIASES
  $ aio event registration ls
  $ aio event reg list
  $ aio event reg ls
```
<!-- commandsstop -->

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
