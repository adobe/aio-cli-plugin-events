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

function validator (input, regex, message) {
  // eslint-disable-next-line no-useless-escape
  const valid = regex
  if (valid.test(input)) {
    return true
  }
  return message
}

function sentenceValidatorWithMinOneChar (input) {
  return validator(input, /^[\w\s-_.(),@:'`?#!]{1,255}$/,
      `The input: ${input} is invalid, please use < 255 characters string with a combination of alphanumeric characters, spaces and special characters in '-_.(),@:'\`?#!'`)
}

function sentenceValidatorWithMinZeroChar (input) {
  if (input === undefined || input === '') { return true }
  return sentenceValidatorWithMinOneChar(input)
}

function eventCodeValidator (input) {
  return validator(input, /^[\w-_.]{1,255}$/,
      `The input: ${input} is invalid, please use at least one and < 255 characters string with a combination of alphanumeric characters and special characters in '-_.'`)
}

module.exports = {
  sentenceValidatorWithMinOneChar,
  sentenceValidatorWithMinZeroChar,
  eventCodeValidator
}
