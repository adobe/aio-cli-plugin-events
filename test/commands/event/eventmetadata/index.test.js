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

const IndexCommand = require('../../../../src/commands/event/eventmetadata')
const BaseCommand = require('../../../../src/BaseCommand')
const Help = require('@oclif/plugin-help').default

test('exports', async () => {
  expect(typeof IndexCommand).toEqual('function')
  expect(IndexCommand.prototype instanceof BaseCommand).toBeTruthy()
})

test('description', async () => {
  expect(IndexCommand.description).toBeDefined()
})

test('args', async () => {
  expect(IndexCommand.args).toBeUndefined()
})

test('flags', async () => {
  expect(IndexCommand.flags.help.type).toBe('boolean')
})

describe('instance methods', () => {
  let command

  beforeEach(() => {
    command = new IndexCommand([])
    command.initSdk = jest.fn()
  })

  describe('run', () => {
    test('exists', async () => {
      expect(command.run).toBeInstanceOf(Function)
    })

    test('returns help file for event metadata command', () => {
      const spy = jest.spyOn(Help.prototype, 'showHelp').mockReturnValue(true)
      return command.run().then(() => {
        expect(spy).toHaveBeenCalledWith(['event:eventmetadata', '--help'])
      })
    })
  })
})
