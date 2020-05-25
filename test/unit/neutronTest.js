/*
 * Copyright (c) 2016 Internap.
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

import Neutron from '../../src/neutron.js'
import * as mockData from './helpers/data/neutron'
import fetchMock from 'fetch-mock'

describe('neutron', () => {
  afterEach(fetchMock.restore)

  it('should export a class', () => {
    const neutron = new Neutron(mockData.config)
    expect(neutron).toBeDefined()
  })

  it('should throw an error for an empty config', () => {
    try {
      const neutron = new Neutron()
      neutron.versions()
    } catch (e) {
      expect(e.message).toEqual('An endpoint configuration is required.')
    }
  })

  describe('networkList()', () => {
    let neutron = null

    beforeEach(() => {
      fetchMock.mock(mockData.root())
      neutron = new Neutron(mockData.config)
    })

    it('should return the networks as an array.', (done) => {
      const token = 'test_token'

      fetchMock.mock(mockData.networkList(token))
      neutron
        .networkList(token)
        .then((networks) => {
          expect(networks.length).toBe(2)
          done()
        })
        .catch((error) => done.fail(error))
    })

    it('Should not cache its results', (done) => {
      const token = 'test_token'

      const mockOptions = mockData.networkList(token)
      fetchMock.mock(mockOptions)

      neutron
        .networkList(token)
        .then(() => {
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(1)
          return neutron.networkList(token)
        })
        .then(() => {
          expect(fetchMock.calls(mockOptions.matcher).length).toEqual(2)
          done()
        })
        .catch((error) => done.fail(error))
    })
  })
})
