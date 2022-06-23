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

# Adobe I/O Events CLI Plugin

Adobe I/O Events Plugin for the Adobe I/O CLI

<!-- toc -->
* [Adobe I/O Events CLI Plugin](#adobe-io-events-cli-plugin)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @adobe/aio-cli-plugin-events
$ aio COMMAND
running command...
$ aio (-v|--version|version)
@adobe/aio-cli-plugin-events/1.1.6 darwin-x64 node-v16.13.1
$ aio --help [COMMAND]
USAGE
  $ aio COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`aio event`](#aio-event)
* [`aio event:eventmetadata`](#aio-eventeventmetadata)
* [`aio event:eventmetadata:create PROVIDERID`](#aio-eventeventmetadatacreate-providerid)
* [`aio event:eventmetadata:delete PROVIDERID [EVENTCODE]`](#aio-eventeventmetadatadelete-providerid-eventcode)
* [`aio event:eventmetadata:get PROVIDERID EVENTCODE`](#aio-eventeventmetadataget-providerid-eventcode)
* [`aio event:eventmetadata:list PROVIDERID`](#aio-eventeventmetadatalist-providerid)
* [`aio event:eventmetadata:update PROVIDERID EVENTCODE`](#aio-eventeventmetadataupdate-providerid-eventcode)
* [`aio event:provider`](#aio-eventprovider)
* [`aio event:provider:create`](#aio-eventprovidercreate)
* [`aio event:provider:delete PROVIDERID`](#aio-eventproviderdelete-providerid)
* [`aio event:provider:get PROVIDERID`](#aio-eventproviderget-providerid)
* [`aio event:provider:list`](#aio-eventproviderlist)
* [`aio event:provider:update PROVIDERID`](#aio-eventproviderupdate-providerid)
* [`aio event:registration`](#aio-eventregistration)
* [`aio event:registration:create BODYJSONFILE`](#aio-eventregistrationcreate-bodyjsonfile)
* [`aio event:registration:delete REGISTRATIONID`](#aio-eventregistrationdelete-registrationid)
* [`aio event:registration:get REGISTRATIONID`](#aio-eventregistrationget-registrationid)
* [`aio event:registration:list`](#aio-eventregistrationlist)

## `aio event`

Manage your Adobe I/O Events

```
USAGE
  $ aio event

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version
```

_See code: [src/commands/event/index.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/index.js)_

## `aio event:eventmetadata`

Manage your Adobe I/O Events Providers' Event Metadata

```
USAGE
  $ aio event:eventmetadata

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version
```

_See code: [src/commands/event/eventmetadata/index.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/eventmetadata/index.js)_

## `aio event:eventmetadata:create PROVIDERID`

Create an Event Metadata for a Provider

```
USAGE
  $ aio event:eventmetadata:create PROVIDERID

ARGUMENTS
  PROVIDERID  The requested eventmetadata event code

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version
```

_See code: [src/commands/event/eventmetadata/create.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/eventmetadata/create.js)_

## `aio event:eventmetadata:delete PROVIDERID [EVENTCODE]`

Delete Event Metadata for a Provider

```
USAGE
  $ aio event:eventmetadata:delete PROVIDERID [EVENTCODE]

ARGUMENTS
  PROVIDERID  The requested provider ID
  EVENTCODE   The requested eventmetadata event code

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version
```

_See code: [src/commands/event/eventmetadata/delete.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/eventmetadata/delete.js)_

## `aio event:eventmetadata:get PROVIDERID EVENTCODE`

Get details of an Event Code of a Provider

```
USAGE
  $ aio event:eventmetadata:get PROVIDERID EVENTCODE

ARGUMENTS
  PROVIDERID  The requested provider ID
  EVENTCODE   The requested eventmetadata event code

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version
```

_See code: [src/commands/event/eventmetadata/get.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/eventmetadata/get.js)_

## `aio event:eventmetadata:list PROVIDERID`

List all Event Metadata for a Provider

```
USAGE
  $ aio event:eventmetadata:list PROVIDERID

ARGUMENTS
  PROVIDERID  The requested provider ID

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

ALIASES
  $ aio event:eventmetadata:ls
```

_See code: [src/commands/event/eventmetadata/list.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/eventmetadata/list.js)_

## `aio event:eventmetadata:update PROVIDERID EVENTCODE`

Update an Event Metadata for a Provider

```
USAGE
  $ aio event:eventmetadata:update PROVIDERID EVENTCODE

ARGUMENTS
  PROVIDERID  The requested provider ID
  EVENTCODE   The requested eventmetadata event code

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version
```

_See code: [src/commands/event/eventmetadata/update.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/eventmetadata/update.js)_

## `aio event:provider`

Manage your Adobe I/O Events Providers

```
USAGE
  $ aio event:provider

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version
```

_See code: [src/commands/event/provider/index.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/provider/index.js)_

## `aio event:provider:create`

Create a new Provider

```
USAGE
  $ aio event:provider:create

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version
```

_See code: [src/commands/event/provider/create.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/provider/create.js)_

## `aio event:provider:delete PROVIDERID`

Delete Provider by id

```
USAGE
  $ aio event:provider:delete PROVIDERID

ARGUMENTS
  PROVIDERID  The requested provider ID

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version
```

_See code: [src/commands/event/provider/delete.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/provider/delete.js)_

## `aio event:provider:get PROVIDERID`

Get details of Provider by id

```
USAGE
  $ aio event:provider:get PROVIDERID

ARGUMENTS
  PROVIDERID  The requested provider ID

OPTIONS
  -j, --json            Output json
  -v, --verbose         Verbose output
  -y, --yml             Output yml
  --fetchEventMetadata  Fetch event metadata with provider
  --help                Show help
  --version             Show version
```

_See code: [src/commands/event/provider/get.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/provider/get.js)_

## `aio event:provider:list`

Get list of all Providers for the Organization

```
USAGE
  $ aio event:provider:list

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

ALIASES
  $ aio event:provider:ls
```

_See code: [src/commands/event/provider/list.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/provider/list.js)_

## `aio event:provider:update PROVIDERID`

Update an existing Provider

```
USAGE
  $ aio event:provider:update PROVIDERID

ARGUMENTS
  PROVIDERID  The requested provider ID

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version
```

_See code: [src/commands/event/provider/update.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/provider/update.js)_

## `aio event:registration`

Manage your Adobe I/O Events Registrations

```
USAGE
  $ aio event:registration

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version
```

_See code: [src/commands/event/registration/index.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/registration/index.js)_

## `aio event:registration:create BODYJSONFILE`

Create a new Event Registration in your Workspace

```
USAGE
  $ aio event:registration:create BODYJSONFILE

ARGUMENTS
  BODYJSONFILE
      Path to a file in JSON format with the information to create a new Event Registration.
      The JSON should follow the following format:
      {
      "name": "<event registration name>",
      "description": "<event registration description>",
      "delivery_type": "WEBHOOK|WEBHOOK_BATCH|JOURNAL",
      "webhook_url": "<webhook URL responding to challenge>"
      "events_of_interest": [{
      "provider_id": "<event provider id>"
      "event_code": "<event provider event_code metadata>"
      }, { <...more events> }]
      }

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

ALIASES
  $ aio event:reg:create
```

_See code: [src/commands/event/registration/create.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/registration/create.js)_

## `aio event:registration:delete REGISTRATIONID`

Delete Registration

```
USAGE
  $ aio event:registration:delete REGISTRATIONID

ARGUMENTS
  REGISTRATIONID  The requested registration ID

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version

ALIASES
  $ aio event:reg:delete
```

_See code: [src/commands/event/registration/delete.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/registration/delete.js)_

## `aio event:registration:get REGISTRATIONID`

Get an Event Registration in your Workspace

```
USAGE
  $ aio event:registration:get REGISTRATIONID

ARGUMENTS
  REGISTRATIONID  The requested registration ID

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

ALIASES
  $ aio event:reg:get
```

_See code: [src/commands/event/registration/get.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/registration/get.js)_

## `aio event:registration:list`

List your Event Registrations in your Workspace

```
USAGE
  $ aio event:registration:list

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

ALIASES
  $ aio event:registration:ls
  $ aio event:reg:list
  $ aio event:reg:ls
```

_See code: [src/commands/event/registration/list.js](https://github.com/adobe/aio-cli-plugin-events/blob/v1.1.6/src/commands/event/registration/list.js)_
<!-- commandsstop -->

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
