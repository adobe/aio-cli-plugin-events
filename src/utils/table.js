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
 * Renders a simple text table, compatible with the ux.table API removed in @oclif/core v4.
 *
 * @param {Array<object>} data rows to display
 * @param {object} columns column definitions: { key: { header, minWidth } }
 * @param {object} options optional options: { printLine }
 */
function table (data, columns, options = {}) {
  const printLine = options.printLine || console.log.bind(console)
  const headerKeys = Object.keys(columns)

  const colWidths = headerKeys.map(key => {
    const col = columns[key]
    const header = col.header || key.toUpperCase()
    let maxWidth = col.minWidth || header.length

    if (header.length > maxWidth) maxWidth = header.length
    data.forEach(row => {
      const strValue = String(row[key] ?? '')
      if (strValue.length > maxWidth) maxWidth = strValue.length
    })

    const isLastColumn = headerKeys.indexOf(key) === headerKeys.length - 1
    if (col.minWidth && maxWidth === col.minWidth && !isLastColumn) {
      maxWidth--
    }
    return maxWidth
  })

  const headers = headerKeys.map((key, idx) =>
    (columns[key].header || key.toUpperCase()).padEnd(colWidths[idx], ' ')
  )
  printLine(' ' + headers.join(' ') + ' ')

  const separator = colWidths.map(w => '─'.repeat(w)).join(' ')
  printLine(' ' + separator + ' ')

  data.forEach(row => {
    const values = headerKeys.map((key, idx) =>
      String(row[key] ?? '').padEnd(colWidths[idx], ' ')
    )
    printLine(' ' + values.join(' ') + ' ')
  })
}

module.exports = { table }
