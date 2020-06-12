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

import Http from '../../../src/util/http.js'
import fetchMock from 'fetch-mock'

describe('Http', () => {
  let http
  const testUrl = 'https://example.com/'
  const testRequest = { lol: 'cat' }
  const testResponse = { foo: 'bar' }

  beforeEach(() => {
    http = new Http()
  })

  afterEach(fetchMock.restore)

  it('should permit manually constructing requests', (done) => {
    fetchMock.get(testUrl, testResponse)

    http.httpRequest('GET', testUrl)
      .then((response) => response.json())
      .then((body) => {
        expect(fetchMock.called(testUrl)).toBe(true)
        expect(body).toEqual(testResponse)
        done()
      })
      .catch((error) => done.fail(error))
  })

  it('should make GET requests', (done) => {
    fetchMock.get(testUrl, testResponse)

    http.httpGet(testUrl)
      .then((response) => response.json())
      .then((body) => {
        expect(fetchMock.called(testUrl)).toBe(true)
        expect(body).toEqual(testResponse)
        done()
      })
      .catch((error) => done.fail(error))
  })

  it('should make PUT requests', (done) => {
    fetchMock.put(testUrl, testResponse, testRequest)

    http.httpPut(testUrl, testRequest)
      .then((response) => response.json())
      .then((body) => {
        expect(fetchMock.called(testUrl)).toEqual(true)
        expect(body).toEqual(testResponse)
        done()
      })
      .catch((error) => done.fail(error))
  })

  it('should make POST requests', (done) => {
    fetchMock.post(testUrl, testResponse, testRequest)

    http.httpPost(testUrl, testRequest)
      .then((response) => response.json())
      .then((body) => {
        expect(fetchMock.called(testUrl)).toEqual(true)
        expect(body).toEqual(testResponse)
        done()
      })
      .catch((error) => done.fail(error))
  })

  it('should make DELETE requests', (done) => {
    fetchMock.delete(testUrl, testRequest)

    http.httpDelete(testUrl, testRequest)
      .then(() => {
        expect(fetchMock.called(testUrl)).toEqual(true)
        done()
      })
      .catch((error) => done.fail(error))
  })

  it('should permit setting default headers', (done) => {
    http.defaultHeaders['Custom-Header'] = 'Custom-Value'
    fetchMock.get(testUrl, testResponse)

    http.httpGet(testUrl)
      .then(() => {
        const headers = fetchMock.lastOptions().headers
        expect(headers['Custom-Header']).toEqual('Custom-Value')
        done()
      })
      .catch((error) => done.fail(error))
  })

  it('should pass exceptions back to the invoker', (done) => {
    fetchMock.get(testUrl, () => {
      throw new TypeError() // Example- net::ERR_NAME_NOT_RESOLVED
    })

    http.httpGet(testUrl)
      .then((response) => done.fail(response))
      .catch((error) => {
        expect(error.stack).toBeDefined()
        done()
      })
  })

  it('should pass failed requests to the catch block.', (done) => {
    fetchMock.get(testUrl, { status: 500, body: testResponse })

    http.httpGet(testUrl)
      .then((response) => done.fail(response))
      .catch((response) => {
        expect(response.status).toBe(500)
        done()
      })
  })

  it('should not interfere with mocks that have matching headers.', (done) => {
    fetchMock.mock({
      method: 'GET',
      matcher: testUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      response: testResponse
    })

    http
      .httpRequest('GET', testUrl, { 'Content-Type': 'application/json' })
      .then(() => done())
      .catch((error) => done.fail(error))
  })
})
