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

/**
 * Validate input against a regular expression
 *
 * @param {string} input to be validated
 * @param {object} regex the regular expression to validate the input against
 * @param {string} message error message in case of a failed validation
 * @returns {string|boolean} message or error message
 */
function validator (input, regex, message) {
  // eslint-disable-next-line no-useless-escape
  const valid = regex
  if (valid.test(input)) {
    return true
  }
  return message
}

/**
 * @param {string} input validate input for sentence type of minimum one character and maximum of 255 characters
 * @returns {string|boolean} message or error message
 */
function sentenceValidatorWithMinOneChar (input) {
  return validator(input, /^[\w\s-_.(),@:'`?#!]{1,255}$/,
      `The input: ${input} is invalid, please use < 255 characters string with a combination of alphanumeric characters, spaces and special characters in '-_.(),@:'\`?#!'`)
}

/**
 * @param {string} input validate input for sentence type
 * @returns {string|boolean} message or error message
 */
function sentenceValidatorWithMinZeroChar (input) {
  if (input === undefined || input === '') { return true }
  return sentenceValidatorWithMinOneChar(input)
}

/**
 * @param {string} input event code to be validated
 * @returns {string|boolean} message or error message
 */
function eventCodeValidator (input) {
  return validator(input, /^[\w-_.]{1,255}$/,
      `The input: ${input} is invalid, please use at least one and < 255 characters string with a combination of alphanumeric characters and special characters in '-_.'`)
}

module.exports = {
  sentenceValidatorWithMinOneChar,
  sentenceValidatorWithMinZeroChar,
  eventCodeValidator
}
