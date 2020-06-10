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
const { sentenceValidatorWithMinOneChar, sentenceValidatorWithMinZeroChar } = require('../../src/utils/validator')

describe('sentence validator with min one character', () => {
  test('empty input', async () => {
    const response = sentenceValidatorWithMinOneChar('')
    expect(response).toBe('The input: \'\' is invalid. Input should match regex: \'/[\\w\\s-_.(),@]{1,255}$/\'')
  })
  test('invalid characters', async () => {
    const response = sentenceValidatorWithMinOneChar('&*')
    expect(response).toBe('The input: \'&*\' is invalid. Input should match regex: \'/[\\w\\s-_.(),@]{1,255}$/\'')
  })
  test('valid input', async () => {
    const response = sentenceValidatorWithMinOneChar('This (is)_ a valid-input, this should @pass.')
    expect(response).toBe(true)
  })
})

describe('sentence validator with min zero characters', () => {
  test('empty input', async () => {
    const response = sentenceValidatorWithMinZeroChar('')
    expect(response).toBe(true)
  })
  test('invalid characters', async () => {
    const response = sentenceValidatorWithMinZeroChar('&*')
    expect(response).toBe('The input: \'&*\' is invalid. Input should match regex: \'/[\\w\\s-_.(),@]{1,255}$/\'')
  })
  test('valid input', async () => {
    const response = sentenceValidatorWithMinZeroChar('This (is)_ a valid-input, this should @pass.')
    expect(response).toBe(true)
  })
})
