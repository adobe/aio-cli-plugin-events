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
$ ./bin/run COMMAND
running command...
$ ./bin/run (-v|--version|version)
@adobe/aio-cli-plugin-events/1.0.0 darwin-x64 node-v12.13.1
$ ./bin/run --help [COMMAND]
USAGE
  $ ./bin/run COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`./bin/run event`](#binrun-event)
* [`./bin/run event:eventmetadata`](#binrun-eventeventmetadata)
* [`./bin/run event:eventmetadata:create PROVIDERID`](#binrun-eventeventmetadatacreate-providerid)
* [`./bin/run event:eventmetadata:delete PROVIDERID [EVENTCODE]`](#binrun-eventeventmetadatadelete-providerid-eventcode)
* [`./bin/run event:eventmetadata:get PROVIDERID EVENTCODE`](#binrun-eventeventmetadataget-providerid-eventcode)
* [`./bin/run event:eventmetadata:list PROVIDERID`](#binrun-eventeventmetadatalist-providerid)
* [`./bin/run event:eventmetadata:update PROVIDERID EVENTCODE`](#binrun-eventeventmetadataupdate-providerid-eventcode)
* [`./bin/run event:provider`](#binrun-eventprovider)
* [`./bin/run event:provider:create`](#binrun-eventprovidercreate)
* [`./bin/run event:provider:delete PROVIDERID`](#binrun-eventproviderdelete-providerid)
* [`./bin/run event:provider:get PROVIDERID`](#binrun-eventproviderget-providerid)
* [`./bin/run event:provider:list`](#binrun-eventproviderlist)
* [`./bin/run event:provider:update PROVIDERID`](#binrun-eventproviderupdate-providerid)
* [`./bin/run event:registration`](#binrun-eventregistration)
* [`./bin/run event:registration:create BODYJSONFILE`](#binrun-eventregistrationcreate-bodyjsonfile)
* [`./bin/run event:registration:delete REGISTRATIONID`](#binrun-eventregistrationdelete-registrationid)
* [`./bin/run event:registration:get REGISTRATIONID`](#binrun-eventregistrationget-registrationid)
* [`./bin/run event:registration:list`](#binrun-eventregistrationlist)

## `./bin/run event`

Manage your Adobe I/O Events

```
USAGE
  $ ./bin/run event

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version
```

## `./bin/run event:eventmetadata`

Manage your Adobe I/O Events Providers' Event Metadata

```
USAGE
  $ ./bin/run event:eventmetadata

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version
```

## `./bin/run event:eventmetadata:create PROVIDERID`

Create an Event Metadata for a Provider

```
USAGE
  $ ./bin/run event:eventmetadata:create PROVIDERID

ARGUMENTS
  PROVIDERID  The requested eventmetadata event code

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version
```

## `./bin/run event:eventmetadata:delete PROVIDERID [EVENTCODE]`

Delete Event Metadata for a Provider

```
USAGE
  $ ./bin/run event:eventmetadata:delete PROVIDERID [EVENTCODE]

ARGUMENTS
  PROVIDERID  The requested provider ID
  EVENTCODE   The requested eventmetadata event code

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version
```

## `./bin/run event:eventmetadata:get PROVIDERID EVENTCODE`

Get details of an Event Code of a Provider

```
USAGE
  $ ./bin/run event:eventmetadata:get PROVIDERID EVENTCODE

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

## `./bin/run event:eventmetadata:list PROVIDERID`

List all Event Metadata for a Provider

```
USAGE
  $ ./bin/run event:eventmetadata:list PROVIDERID

ARGUMENTS
  PROVIDERID  The requested provider ID

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

ALIASES
  $ ./bin/run event:eventmetadata:ls
```

## `./bin/run event:eventmetadata:update PROVIDERID EVENTCODE`

Update an Event Metadata for a Provider

```
USAGE
  $ ./bin/run event:eventmetadata:update PROVIDERID EVENTCODE

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

## `./bin/run event:provider`

Manage your Adobe I/O Events Providers

```
USAGE
  $ ./bin/run event:provider

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version
```

## `./bin/run event:provider:create`

Create a new Provider

```
USAGE
  $ ./bin/run event:provider:create

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version
```

## `./bin/run event:provider:delete PROVIDERID`

Delete Provider by id

```
USAGE
  $ ./bin/run event:provider:delete PROVIDERID

ARGUMENTS
  PROVIDERID  The requested provider ID

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version
```

## `./bin/run event:provider:get PROVIDERID`

Get details of Provider by id

```
USAGE
  $ ./bin/run event:provider:get PROVIDERID

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

## `./bin/run event:provider:list`

Get list of all Providers for the Organization

```
USAGE
  $ ./bin/run event:provider:list

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

ALIASES
  $ ./bin/run event:provider:ls
```

## `./bin/run event:provider:update PROVIDERID`

Update an existing Provider

```
USAGE
  $ ./bin/run event:provider:update PROVIDERID

ARGUMENTS
  PROVIDERID  The requested provider ID

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version
```

## `./bin/run event:registration`

Manage your Adobe I/O Events Registrations

```
USAGE
  $ ./bin/run event:registration

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version
```

## `./bin/run event:registration:create BODYJSONFILE`

Create a new Event Registration in your Workspace

```
USAGE
  $ ./bin/run event:registration:create BODYJSONFILE

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
  $ ./bin/run event:reg:create
```

## `./bin/run event:registration:delete REGISTRATIONID`

Delete Registration

```
USAGE
  $ ./bin/run event:registration:delete REGISTRATIONID

ARGUMENTS
  REGISTRATIONID  The requested registration ID

OPTIONS
  -v, --verbose  Verbose output
  --help         Show help
  --version      Show version

ALIASES
  $ ./bin/run event:reg:delete
```

## `./bin/run event:registration:get REGISTRATIONID`

Get an Event Registration in your Workspace

```
USAGE
  $ ./bin/run event:registration:get REGISTRATIONID

ARGUMENTS
  REGISTRATIONID  The requested registration ID

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

ALIASES
  $ ./bin/run event:reg:get
```

## `./bin/run event:registration:list`

List your Event Registrations in your Workspace

```
USAGE
  $ ./bin/run event:registration:list

OPTIONS
  -j, --json     Output json
  -v, --verbose  Verbose output
  -y, --yml      Output yml
  --help         Show help
  --version      Show version

ALIASES
  $ ./bin/run event:registration:ls
  $ ./bin/run event:reg:list
  $ ./bin/run event:reg:ls
```
<!-- commandsstop -->

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
