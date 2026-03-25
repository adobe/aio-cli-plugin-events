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

const aioLibConfig = require('@adobe/eslint-config-aio-lib-config')
const pluginJest = require('eslint-plugin-jest')

module.exports = [
  ...aioLibConfig,
  {
    settings: {
      jsdoc: {
        ignorePrivate: true
      }
    },
    rules: {
      'jsdoc/tag-lines': [
        'error',
        'never',
        {
          startLines: null
        }
      ]
    }
  },
  {
    files: ['test/**/*.js'],
    ...pluginJest.configs['flat/recommended'],
    rules: {
      ...pluginJest.configs['flat/recommended'].rules
    }
  },
  {
    files: ['e2e/**/*.js'],
    ...pluginJest.configs['flat/recommended'],
    rules: {
      ...pluginJest.configs['flat/recommended'].rules,
      'n/no-unpublished-require': 'off'
    }
  }
]
