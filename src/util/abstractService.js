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

import Http from './http'
import Version from './version'
import URL from 'url-parse'

export default class AbstractService {
  /**
   * This class provides an abstract implementation of our services, which includes logic common to
   * all of our services.
   *
   * @param {string} endpointUrl The endpoint URL.
   * @param {Array} supportedVersions The list of all supported versions.
   */
  constructor (endpointUrl, supportedVersions) {
    this._endpointUrl = endpointUrl
    this._supportedVersions = supportedVersions
  }

  /**
   * Our HTTP service instance.
   *
   * @returns {Http} Our HTTP service instance.
   */
  get http () {
    if (!this._http) {
      this._http = new Http()
    }
    return this._http
  }

  /**
   * List of all supported versions.
   *
   * @returns {Array} The list of all supported versions, or empty array.
   */
  get supportedVersions () {
    return this._supportedVersions || []
  }

  /**
   * Our endpoint URL for this service.
   *
   * @returns {string} The URL of our service.
   */
  get endpointUrl () {
    return this._endpointUrl
  }

  /**
   * Retrieve all the API versions available.
   *
   * @returns {Promise.<Version[]>} A promise that will resolve with the list of API versions.
   */
  versions () {
    return this._rawVersions().then((versions) => {
      return versions.map((rawVersion) => {
        const version = new Version(rawVersion.id)
        version.links = rawVersion.links
        return version
      })
    })
  }

  /**
   * Retrieve all the raw API versions available.
   *
   * @returns {Promise.<Object[]>} A promise that will resolve with the list of raw versions.
   * @protected
   */
  _rawVersions () {
    return new Promise((resolve, reject) => {
      this.http
        .httpGet(this._endpointUrl)
        .catch((response) => {
          if (response.status === 401) {
            const rootUrl = new URL(this._endpointUrl)
            rootUrl.set('pathname', '/')
            rootUrl.set('query', '')
            rootUrl.set('hash', '')

            return this.http.httpGet(rootUrl.href)
          } else {
            throw response
          }
        })
        .then((response) => response.json())
        .then((body) => resolve(body.versions))
        .catch(reject)
    })
  }

  /**
   * Retrieve the API version declaration that is currently in use by this instance.
   *
   * @returns {Promise.<Version>} A promise that will resolve with the specific API version.
   */
  version () {
    return this
      .versions()
      .then((versions) => {
        for (const version of versions) {
          if (this.supportedVersions.find(version.supports)) {
            return version
          }
        }
        throw new Error('No supported API version available.')
      })
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
              const link = version.links[i]
              if (link.rel === 'self' && link.href) {
                return link.href
              }
            }
          }
          throw new Error('No service endpoint discovered.')
        })
    }
    return this._endpointPromise
  }

  /**
   * This method builds common components for a request to the implemented service.
   * It converts any passed token into a promise, resolves the base URL, and then passes
   * the results as an .all() promise, which may be destructured in a followup request.
   *
   * @param {Promise|String} token A promise, or string, representing a token.
   * @returns {Promise} A promise which resolves with [url, token].
   * @private
   */
  _requestComponents (token = null) {
    // Make sure the token is a promise.
    const headerPromise = Promise
      .resolve(token)
      .then((token) => {
        if (token) {
          return {
            'X-Auth-Token': token
          }
        }
        return {}
      })
    return Promise.all([this.serviceEndpoint(), headerPromise])
  }
}
