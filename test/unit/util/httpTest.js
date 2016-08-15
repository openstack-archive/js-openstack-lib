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

import Http from '../../../src/util/http.js';
import fetchMock from 'fetch-mock';

describe('Http', () => {
  let http;
  const testUrl = 'https://example.com/';
  const testRequest = {lol: 'cat'};
  const testResponse = {foo: 'bar'};

  beforeEach(() => {
    http = new Http();
  });

  afterEach(fetchMock.restore);

  it("should permit manually constructing requests", (done) => {
    fetchMock.get(testUrl, testResponse);

    http.httpRequest('GET', testUrl)
      .then((response) => response.json())
      .then((body) => {
        expect(fetchMock.called(testUrl)).toBe(true);
        expect(body).toEqual(testResponse);
        done();
      })
      .catch((error) => {
        expect(error).toBeNull();
        done();
      });
  });

  it("should make GET requests", (done) => {
    fetchMock.get(testUrl, testResponse);

    http.httpGet(testUrl)
      .then((response) => response.json())
      .then((body) => {
        expect(fetchMock.called(testUrl)).toBe(true);
        expect(body).toEqual(testResponse);
        done();
      })
      .catch((error) => {
        expect(error).toBeNull();
        done();
      });
  });

  it("should make PUT requests", (done) => {
    fetchMock.put(testUrl, testResponse, testRequest);

    http.httpPut(testUrl, testRequest)
      .then((response) => response.json())
      .then((body) => {
        expect(fetchMock.called(testUrl)).toEqual(true);
        expect(body).toEqual(testResponse);
        done();
      })
      .catch((error) => {
        expect(error).toBeNull();
        done();
      });
  });

  it("should make POST requests", (done) => {
    fetchMock.post(testUrl, testResponse, testRequest);

    http.httpPost(testUrl, testRequest)
      .then((response) => response.json())
      .then((body) => {
        expect(fetchMock.called(testUrl)).toEqual(true);
        expect(body).toEqual(testResponse);
        done();
      })
      .catch((error) => {
        expect(error).toBeNull();
        done();
      });
  });

  it("should make DELETE requests", (done) => {
    fetchMock.delete(testUrl, testRequest);

    http.httpDelete(testUrl, testRequest)
      .then(() => {
        expect(fetchMock.called(testUrl)).toEqual(true);
        done();
      })
      .catch((error) => {
        expect(error).toBeNull();
        done();
      });
  });

  it("should permit setting default headers", (done) => {
    http.defaultHeaders['Custom-Header'] = 'Custom-Value';
    fetchMock.get(testUrl, testResponse);

    http.httpGet(testUrl)
      .then(() => {
        let headers = fetchMock.lastOptions().headers;
        expect(headers.get('custom-header')).toEqual('Custom-Value');
        done();
      })
      .catch((error) => {
        expect(error).toBeNull();
        done();
      });
  });

  it("should permit request interception", (done) => {
    fetchMock.get(testUrl, testResponse);

    http.requestInterceptors.push((request) => {
      request.headers.direct = true;
      return request;
    });
    http.requestInterceptors.push((request) => {
      request.headers.promise = true;
      return Promise.resolve(request);
    });

    http.httpGet(testUrl)
      .then(() => {
        let options = fetchMock.lastOptions();
        expect(options.headers.direct).toEqual(true);
        expect(options.headers.promise).toEqual(true);
        done();
      })
      .catch((error) => {
        expect(error).toBeNull();
        done();
      });
  });

  it("should permit response interception", (done) => {
    fetchMock.get(testUrl, testResponse);

    http.responseInterceptors.push((response) => {
      response.headers.direct = true;
      return response;
    });
    http.responseInterceptors.push((response) => {
      response.headers.promise = true;
      return Promise.resolve(response);
    });

    http.httpGet(testUrl)
      .then((response) => {
        expect(response.headers.direct).toEqual(true);
        expect(response.headers.promise).toEqual(true);
        done();
      })
      .catch((error) => {
        expect(error).toBeNull();
        done();
      });
  });

  it("should pass exceptions back to the invoker", (done) => {
    fetchMock.get(testUrl, () => {
      throw new TypeError(); // Example- net::ERR_NAME_NOT_RESOLVED
    });

    http.httpGet(testUrl)
      .then((response) => {
        // We shouldn't reach this point.
        expect(response).toBeNull();
        done();
      })
      .catch((error) => {
        expect(error.stack).toBeDefined();
        done();
      });
  });

  it("should pass failed requests back to the invoker", (done) => {
    fetchMock.get(testUrl, {status: 500, body: testResponse});

    http.httpGet(testUrl)
      .then((response) => {
        // The HTTP request 'succeeded' with a failing state.
        expect(response.status).toEqual(500);
        return response.json();
      })
      .then((body) => {
        expect(body).toEqual(testResponse);
        done();
      })
      .catch((error) => {
        expect(error).toBeNull();
        done();
      });
  });
});
