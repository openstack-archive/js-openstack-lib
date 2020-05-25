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

/**
 * A simple version parser, able to parse various version strings used in OpenStack into a
 * comparable instance.
 */
export default class Version {
  /**
   * The name of the service.
   *
   * @returns {String|*|null} The name of the service, or null.
   */
  get service () {
    return this._service || null
  }

  /**
   * The major version.
   *
   * @returns {Number} The major version number
   */
  get major () {
    return this._major || 0
  }

  /**
   * The minor version.
   *
   * @returns {Number} The minor version number
   */
  get minor () {
    return this._minor || 0
  }

  /**
   * The patch version.
   *
   * @returns {Number} The patch version number.
   */
  get patch () {
    return this._patch || 0
  }

  /**
   * The links of the service
   *
   * @returns {Object[]} The list of links.
   */
  get links () {
    return this._links || null
  }

  /**
   * Sets the links of the service
   *
   * @param {Object[]} links The links to be set
   */
  set links (links) {
    if (Array.isArray(links)) {
      this._links = links
    }
  }

  /**
   * Create a new instance of a service version.
   *
   * @param {String} [service] The name of the service.
   * @param {String} versionString The version string for this service.
   */
  constructor (service, versionString) {
    // Sanitize input
    if (typeof service !== 'string') {
      service = undefined
    }
    if (typeof versionString !== 'string') {
      versionString = undefined
    }

    if (versionString === undefined) {
      versionString = service
    } else {
      this._service = service
    }

    // Sanity check before running regex.
    if (!versionString || !versionString.match) {
      return
    }

    const results = versionString.match(/^(([^ ]+) )?v?(([0-9]+)(\.([0-9]+)(.([0-9]+))?)?)$/)
    if (results) {
      this._service = results[2] || this._service // regex takes precedence
      this._major = parseInt(results[4], 10)
      this._minor = parseInt(results[6], 10)
      this._patch = parseInt(results[8], 10)
    }
    this._links = null

    this.equals = this.equals.bind(this)
    this.supports = this.supports.bind(this)
  }

  /**
   * Compare this instance to another instance or version string.
   *
   * @param {String|Version} version The version to compare to.
   * @returns {boolean} True if they are exactly the same, otherwise false.
   */
  equals (version) {
    if (!(version instanceof Version)) {
      // is it a parseable string?
      if (typeof version === 'string') {
        version = new Version(version)
      } else {
        return false
      }
    }

    return version.major === this.major &&
      version.minor === this.minor &&
      version.patch === this.patch &&
      version.service === this.service
  }

  /**
   * Verifies compatibility of this instance to another instance. Major version should be equal and
   * minor version should be greater or equal than `version` parameter.
   *
   * @param {String|Version} version the version to support.
   * @returns {boolean} True if the version is compatible, otherwise false
   */
  supports (version) {
    if (!(version instanceof Version)) {
      if (typeof version === 'string') {
        version = new Version(version)
      } else {
        return false
      }
    }

    const compatibleVersion = version.service === this.service &&
      version.major === this.major &&
      version.minor <= this.minor

    if (compatibleVersion && version.minor === this.minor) {
      return version.patch <= this.patch
    }
    return compatibleVersion
  }

  toString () {
    let version = `${this.major}.${this.minor}`
    if (this.patch) {
      version = `${version}.${this.patch}`
    }
    return version
  }
}
