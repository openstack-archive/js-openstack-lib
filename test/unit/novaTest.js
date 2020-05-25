/*
 * Copyright (c) 2016 Michael Krotscheck.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Nova from '../../src/nova.js'
import * as mockData from './helpers/data/nova'
import fetchMock from 'fetch-mock'

describe('Nova', () => {
  afterEach(fetchMock.restore)

  it('should export a class', () => {
    const nova = new Nova(mockData.config)
    expect(nova).toBeDefined()
  })

  it('should throw an error for an empty config', () => {
    expect(() => new Nova(null)).toThrow()
  })

  describe('flavorList()', () => {
    let nova = null

    beforeEach(() => {
      fetchMock.mock(mockData.rootVersion())
      fetchMock.mock(mockData.root())
      nova = new Nova(mockData.config)
    })

    it('should return the flavors as an array.', (done) => {
      const token = 'test_token'

      fetchMock.mock(mockData.flavorList(token))
      nova
        .flavorList(token)
        .then((images) => {
          expect(images.length).not.toBe(0)
          done()
        })
        .catch((error) => done.fail(error))
    })

    it('Should not cache its results', (done) => {
      const token = 'test_token'

      const mockOptions = mockData.flavorList(token)
      fetchMock.mock(mockOptions)

      nova
        .flavorList(token)
        .then(() => {
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(1)
          return nova.flavorList(token)
        })
        .then(() => {
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(2)
          done()
        })
        .catch((error) => done.fail(error))
    })
  })
})
