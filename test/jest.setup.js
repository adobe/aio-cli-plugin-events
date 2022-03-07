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

const { stdout, stderr } = require('stdout-stderr')
const fs = jest.requireActual('fs')
const eol = require('eol')
const path = require('path')

jest.setTimeout(30000)
jest.useFakeTimers()

// don't touch the real fs
const mockFs = {
  readFileSync: jest.fn(),
  readFile: jest.fn()
}
jest.mock('fs', () => mockFs)

// clear env variables

// trap console log
beforeEach(() => { stdout.start(); stderr.start() })
afterEach(() => { stdout.stop(); stderr.stop() })

// helper for fixtures
global.fixtureFile = (output) => {
  return fs.readFileSync(path.join(__dirname, '__fixtures__', output)).toString()
}

// helper for fixtures
global.fixtureJson = (output) => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '__fixtures__', output)))
}

// fixture matcher
expect.extend({
  toMatchFixture (received, argument) {
    const val = global.fixtureFile(argument)
    // eslint-disable-next-line jest/no-standalone-expect
    expect(eol.auto(received)).toEqual(eol.auto(val))
    return { pass: true }
  }
})

/**
 * clean trailing whitespace which will vary with different terminal settings
 *
 * @param {string} input input to clean
 * @returns {string} trimmed string
 */
function cleanWhite (input) {
  return eol.split(input).map(line => { return line.trim() }).join(eol.auto)
}

expect.extend({
  toMatchFixtureIgnoreWhite (received, argument) {
    const val = cleanWhite(global.fixtureFile(argument))
    // eat white
    // eslint-disable-next-line jest/no-standalone-expect
    expect(cleanWhite(received)).toEqual(val)
    return { pass: true }
  }
})

expect.extend({
  toMatchFixtureJson (received, argument) {
    const val = global.fixtureJson(argument)
    // eslint-disable-next-line jest/no-standalone-expect
    expect(received).toEqual(val)
    return { pass: true }
  }
})
