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
import AbstractService from './util/abstract_service';

/**
 * A list of all supported versions. Please keep this array sorted by most recent.
 *
 * @type {Array}
 * @ignore
 */
const supportedGlanceVersions = [
  'v2.3'
];

export default class Glance extends AbstractService {

  /**
   * This class provides direct, idempotent, low-level access to the Glance API of a specific
   * cloud. The constructor requires that you provide a specific glance interface endpoint
   * descriptor, as received from keystone's catalog list.
   *
   * @example
   * {
   *   region_id: "RegionOne",
   *   url: "http://127.0.0.1:9292",
   *   region: "RegionOne",
   *   interface: "admin",
   *   id: "0b8b5f0f14904136ab5a4f83f27ec49a"
   * }
   * @param {{}} endpointConfig The configuration element for a specific glance endpoint.
   */
  constructor (endpointConfig) {
    // Sanity checks.
    if (!endpointConfig || !endpointConfig.url) {
      throw new Error('An endpoint configuration is required.');
    }
    // Clone the config, so that this instance is immutable
    // at runtime (no modifying the config after the fact).
    endpointConfig = Object.assign({}, endpointConfig);

    super(endpointConfig.url, supportedGlanceVersions);
    this._config = endpointConfig;
  }

  /**
   * This method resolves any passed token into an appropriate header, as well as the base URL
   * for the glance API. these variables may then be used to feed other requests.
   *
   * @param {Promise|String} token A promise, or string, representing a token.
   * @returns {Promise} A promise which resolves with [url, token].
   * @private
   */
  _requestComponents (token = null) {
    // Make sure the token is a promise.
    let headerPromise = new Promise((resolve) => resolve(token))
      .then((token) => {
        if (token) {
          return {
            'X-Auth-Token': token
          };
        }
        return {};
      });
    return Promise.all([this.serviceEndpoint(), headerPromise]);
  }

  /**
   * Return the root API endpoint for the current supported glance version.
   *
   * @returns {Promise.<T>|*} A promise which will resolve with the endpoint URL string.
   */
  serviceEndpoint () {
    if (!this._endpointPromise) {
      this._endpointPromise = this.version()
        .then((version) => {
          if (version.links) {
            for (let i = 0; i < version.links.length; i++) {
              let link = version.links[i];
              if (link.rel === 'self' && link.href) {
                return link.href;
              }
            }
          }
          throw new Error("No service endpoint discovered.");
        });
    }
    return this._endpointPromise;
  }

  /**
   * List the images available on glance.
   *
   * @param {String} token An authorization token, or a promise which will resolve into one.
   * @returns {Promise.<T>} A promise which will resolve with the list of images.
   */
  imageList (token = null) {
    return this
      ._requestComponents(token)
      .then(([url, headers]) => this.http.httpRequest('GET', `${url}images`, headers))
      .then((response) => response.json())
      .then((body) => body.images);
  }
}
