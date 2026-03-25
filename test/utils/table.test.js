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

const { table } = require('../../src/utils/table')

describe('table utility', () => {
  test('renders table with header and minWidth columns', () => {
    const data = [{ id: 'ID01', label: 'LABEL01' }]
    const columns = {
      id: { header: 'ID', minWidth: 5 },
      label: { header: 'LABEL', minWidth: 10 }
    }
    const lines = []
    table(data, columns, { printLine: (l) => lines.push(l) })
    expect(lines).toHaveLength(3)
    expect(lines[0]).toContain('ID')
    expect(lines[0]).toContain('LABEL')
    expect(lines[2]).toContain('ID01')
    expect(lines[2]).toContain('LABEL01')
  })

  test('falls back to key.toUpperCase() when header is not provided', () => {
    const data = [{ myKey: 'value' }]
    const columns = { myKey: {} }
    const lines = []
    table(data, columns, { printLine: (l) => lines.push(l) })
    expect(lines[0]).toContain('MYKEY')
  })

  test('falls back to header.length when minWidth is not provided', () => {
    const data = [{ name: 'short' }]
    const columns = { name: { header: 'LONGHEADER' } }
    const lines = []
    table(data, columns, { printLine: (l) => lines.push(l) })
    expect(lines[0]).toContain('LONGHEADER')
  })

  test('handles null and undefined values in rows', () => {
    const data = [{ id: null, label: undefined }]
    const columns = {
      id: { header: 'ID' },
      label: { header: 'LABEL' }
    }
    const lines = []
    table(data, columns, { printLine: (l) => lines.push(l) })
    expect(lines[2]).toBeDefined()
  })

  test('uses console.log when printLine is not provided', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const data = [{ id: 'x' }]
    const columns = { id: { header: 'ID' } }
    table(data, columns)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  test('decrements maxWidth when minWidth equals maxWidth and not last column', () => {
    const data = [{ a: 'x', b: 'y' }]
    const columns = {
      a: { header: 'A', minWidth: 5 },
      b: { header: 'B', minWidth: 5 }
    }
    const lines = []
    table(data, columns, { printLine: (l) => lines.push(l) })
    expect(lines).toHaveLength(3)
  })
})
