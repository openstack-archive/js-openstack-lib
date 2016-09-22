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

import 'isomorphic-fetch';
import log from 'loglevel';

/**
 * This utility class provides an abstraction layer for HTTP calls via fetch(). Its purpose is
 * to provide common, SDK-wide behavior for all HTTP requests. Included are:
 *
 * - Access to default headers.
 * - Convenience GET/PUT/POST/DELETE methods.
 * - Passing 4xx and 5xx responses to the catch() handler.
 *
 * In the future, this class chould also be extended to provide:
 *
 * - Some form of progress() support for large uploads and downloads (perhaps via introduction of Q)
 * - Convenience decoding of the response body, depending on Content-Type.
 * - Internal error handling (At this time, HTTP errors are passed to then() rather than catch()).
 * - Other features.
 */
export default class Http {

  /**
   * The default headers which will be sent with every request. A copy of these headers will be
   * added to the Request instance passed through the interceptor chain, and may be
   * modified there.
   *
   * @returns {{string: string}} A mapping of 'headerName': 'headerValue'
   */
  get defaultHeaders() {
    return this._defaultHeaders;
  }

  /**
   * Create a new HTTP handler.
   */
  constructor() {
    // Add default response interceptors.
    this._defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Make a decorated HTTP request.
   *
   * @param {String} method The HTTP method.
   * @param {String} url The request URL.
   * @param {{}} headers A map of HTTP headers.
   * @param {{}} body The body. It will be JSON-Encoded by the handler.
   * @returns {Promise} A promise which will resolve with the processed request response.
   */
  httpRequest(method, url, headers = {}, body) {

    // Sanitize the headers...
    headers = Object.assign({}, headers, this.defaultHeaders);

    // Build the request
    const init = {method, headers};

    // The Request() constructor will throw an error if the method is GET/HEAD, and there's a body.
    if (['GET', 'HEAD'].indexOf(method) === -1 && body) {
      init.body = JSON.stringify(body);
    }
    const request = new Request(url, init);

    // Build the wrapper promise.
    return new Promise((resolve, reject) => {
      log.debug('-->', `HTTP ${method}`, url, JSON.stringify(headers), JSON.stringify(body));
      let promise = fetch(request.url, init);

      // Fetch will treat all http responses (2xx, 3xx, 4xx, 5xx, etc) as successful responses.
      // This will catch all 4xx and 5xx responses and return them to the catch() handler. Note
      // that it's up to the downstream developer to determine whether what they received is an
      // error or a failed response.
      promise.then((response) => {
        log.debug('<--', `HTTP ${response.status}`);
        if (response.status >= 400) {
          return reject(response);
        } else {
          return response;
        }
      });

      promise.then((response) => resolve(response), (error) => reject(error));
    });
  }

  /**
   * Make a raw GET request against a particular URL.
   *
   * @param {String} url The request URL.
   * @returns {Promise} A promise which will resolve with the processed request response.
   */
  httpGet(url) {
    return this.httpRequest('GET', url, {}, null);
  }

  /**
   * Make a raw PUT request against a particular URL.
   *
   * @param {String} url The request URL.
   * @param {{}} body The body. It will be JSON-Encoded by the handler.
   * @returns {Promise} A promise which will resolve with the processed request response.
   */
  httpPut(url, body) {
    return this.httpRequest('PUT', url, {}, body);
  }

  /**
   * Make a raw POST request against a particular URL.
   *
   * @param {String} url The request URL.
   * @param {{}} body The body. It will be JSON-Encoded by the handler.
   * @returns {Promise} A promise which will resolve with the processed request response.
   */
  httpPost(url, body) {
    return this.httpRequest('POST', url, {}, body);
  }

  /**
   * Make a raw DELETE request against a particular URL.
   *
   * @param {String} url The request URL.
   * @returns {Promise} A promise which will resolve with the processed request response.
   */
  httpDelete(url) {
    return this.httpRequest('DELETE', url, {}, null);
  }
}
