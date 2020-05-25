/*
 * Copyright (c) 2016 Hewlett Packard Enterprise Development L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See
 * the License for the specific language governing permissions and limitations
 * under the License.
 */

import Version from '../../../src/util/version.js'

describe('Version', () => {
  it('should parse various header versions', () => {
    const testVersion = function (args, results) {
      const v = new Version(...args)
      expect(v.service).toBe(results[0])
      expect(v.major).toBe(results[1])
      expect(v.minor).toBe(results[2])
      expect(v.patch).toBe(results[3])
    }

    testVersion(['identity 1.2'], ['identity', 1, 2, 0])
    testVersion(['identity 0.2'], ['identity', 0, 2, 0])
    testVersion(['compute 2222222.09'], ['compute', 2222222, 9, 0])
    testVersion(['compute 03.09'], ['compute', 3, 9, 0])
    testVersion(['compute 03.0'], ['compute', 3, 0, 0])
    testVersion(['compute 1'], ['compute', 1, 0, 0])
    testVersion(['compute 0'], ['compute', 0, 0, 0])
    testVersion(['v2.1.1'], [null, 2, 1, 1])
    testVersion(['v2.1'], [null, 2, 1, 0])
    testVersion(['v2'], [null, 2, 0, 0])
    testVersion(['v'], [null, 0, 0, 0])
    testVersion(['v0.2'], [null, 0, 2, 0])
    testVersion(['2.1.1'], [null, 2, 1, 1])
    testVersion(['2.1'], [null, 2, 1, 0])
    testVersion(['2'], [null, 2, 0, 0])
    testVersion([''], [null, 0, 0, 0])
    testVersion(['0.2'], [null, 0, 2, 0])
    testVersion(['compute', 'v2.1.1'], ['compute', 2, 1, 1])
    testVersion(['compute', 'v2.1'], ['compute', 2, 1, 0])
    testVersion(['compute', 'v2'], ['compute', 2, 0, 0])
    testVersion(['compute', 'v'], ['compute', 0, 0, 0])
    testVersion(['compute', 'v0.2'], ['compute', 0, 2, 0])
    testVersion(['compute', '2.1.1'], ['compute', 2, 1, 1])
    testVersion(['compute', '2.1'], ['compute', 2, 1, 0])
    testVersion(['compute', '2'], ['compute', 2, 0, 0])
    testVersion(['compute', ''], ['compute', 0, 0, 0])
    testVersion(['compute', '0.2'], ['compute', 0, 2, 0])

    // Invalid inputs...
    testVersion([null, null], [null, 0, 0, 0])
    testVersion([{}, {}], [null, 0, 0, 0])
    testVersion([null, {}], [null, 0, 0, 0])
    testVersion([{}, null], [null, 0, 0, 0])
  })

  it('should test for correct equality', () => {
    const v1 = new Version('compute', '1.0.0')

    // String tests...
    expect(v1.equals('compute 1.0.0')).toBe(true)
    expect(v1.equals('compute 1.0.1')).toBe(false)
    expect(v1.equals('identity 1.0.0')).toBe(false)

    // Version tests
    expect(v1.equals(new Version('compute 1.0.0'))).toBe(true)
    expect(v1.equals(new Version('compute 1.0.1'))).toBe(false)
    expect(v1.equals(new Version('identity 1.0.0'))).toBe(false)
    expect(v1.equals(new Version('1.0.0'))).toBe(false)

    // Other tests...
    expect(v1.equals({})).toBe(false)

    const v2 = new Version('1.0.0')

    // String tests...
    expect(v2.equals('compute 1.0.0')).toBe(false)
    expect(v2.equals('compute 1.0.1')).toBe(false)
    expect(v2.equals('1.0.0')).toBe(true)

    // Version tests
    expect(v2.equals(new Version('compute 1.0.0'))).toBe(false)
    expect(v2.equals(new Version('compute 1.0.1'))).toBe(false)
    expect(v2.equals(new Version('identity 1.0.0'))).toBe(false)
    expect(v2.equals(new Version('1.0.0'))).toBe(true)

    // Other tests...
    expect(v2.equals({})).toBe(false)
  })

  it('should test for correct compatibility', () => {
    const v1 = new Version('compute', '1.3.2')

    // String tests
    expect(v1.supports('compute 1.0.0')).toBe(true)
    expect(v1.supports('compute 1.0.1')).toBe(true)
    expect(v1.supports('compute 1.3.0')).toBe(true)
    expect(v1.supports('compute 1.3.3')).toBe(false)
    expect(v1.supports('compute 1.4.0')).toBe(false)
    expect(v1.supports('compute 2.3.0')).toBe(false)

    // Version tests
    expect(v1.supports(new Version('compute', '1.0.0'))).toBe(true)
    expect(v1.supports(new Version('compute', '1.0.1'))).toBe(true)
    expect(v1.supports(new Version('compute', '1.3.0'))).toBe(true)
    expect(v1.supports(new Version('compute', '1.3.3'))).toBe(false)
    expect(v1.supports(new Version('compute', '1.4.0'))).toBe(false)
    expect(v1.supports(new Version('compute', '2.3.0'))).toBe(false)

    const v2 = new Version('1.3.2')
    // String tests
    expect(v2.supports('1.0.0')).toBe(true)
    expect(v2.supports('1.0.1')).toBe(true)
    expect(v2.supports('1.3.0')).toBe(true)
    expect(v2.supports('1.3.3')).toBe(false)
    expect(v2.supports('1.4.0')).toBe(false)
    expect(v2.supports('2.3.0')).toBe(false)

    // Version tests
    expect(v2.supports(new Version('1.0.0'))).toBe(true)
    expect(v2.supports(new Version('1.0.1'))).toBe(true)
    expect(v2.supports(new Version('1.3.0'))).toBe(true)
    expect(v2.supports(new Version('1.3.3'))).toBe(false)
    expect(v2.supports(new Version('1.4.0'))).toBe(false)
    expect(v2.supports(new Version('2.3.0'))).toBe(false)
  })

  it('should store links', () => {
    const v1 = new Version('compute', '1.3.2')

    expect(v1.links).toBe(null)

    v1.links = 'wrong data'
    expect(v1.links).toBe(null)

    v1.links = [
      {
        href: 'http://example.org/v2/',
        rel: 'self'
      }
    ]
    expect(v1.links).not.toBe(null)
    expect(v1.links.length).toBe(1)
    expect(v1.links[0]).toEqual({
      href: 'http://example.org/v2/',
      rel: 'self'
    })
  })
})
