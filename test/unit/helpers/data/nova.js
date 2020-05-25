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
 * This file contains test data for fetchMock, to simplify bootstrapping of unit tests for
 * nova. Most of these are functions, as FetchMock does not perform a safe clone of the
 * instances, and may accidentally modify them at runtime.
 */

/**
 * A catalog entry that matches what we expect from the Keystone Catalog for nova compute.
 */
const novaConfig = {
  region_id: 'RegionOne',
  url: 'http://192.168.99.99:8774/v2.1',
  region: 'RegionOne',
  interface: 'public',
  id: 'be681632633d4a62a781148c2fedd6aa'
}

/**
 * Build a new FetchMock configuration for the root endpoint.
 *
 * @returns {{}} A full FetchMock configuration for Nova's Root Resource.
 */
function rootResponse () {
  return {
    method: 'GET',
    matcher: 'http://192.168.99.99:8774/',
    response: {
      versions: [{
        status: 'CURRENT',
        updated: '2013-07-23T11:33:21Z',
        links: [{ href: 'http://192.168.99.99:8774/v2.1/', rel: 'self' }],
        min_version: '2.1',
        version: '2.38',
        id: 'v2.1'
      }, {
        status: 'SUPPORTED',
        updated: '2011-01-21T11:33:21Z',
        links: [{ href: 'http://192.168.99.99:8774/v2/', rel: 'self' }],
        min_version: '',
        version: '',
        id: 'v2.0'
      }]
    }
  }
}

/**
 * Create a FAILING response to the version endpoint.
 *
 * @param {String} version The version ID.
 * @return {{}} A FetchMock configuration for this request's response.
 */
function versionedRootResponse (version = 'v2.1') {
  return {
    method: 'GET',
    matcher: `http://192.168.99.99:8774/${version}`,
    response: {
      status: 401
    }
  }
}

/**
 * Simulate an imageList response.
 *
 * @param {String} token An auth token.
 * @return {{}} A FetchMock configuration for this request's response.
 */
function flavorList (token) {
  return {
    method: 'GET',
    matcher: 'http://192.168.99.99:8774/v2.1/flavors',
    headers: {
      'X-Auth-Token': token
    },
    response: {
      flavors: [{
        id: '1',
        links: [
          { href: 'http://192.168.99.99:8774/v2.1/flavors/1', rel: 'self' },
          { href: 'http://192.168.99.99:8774/flavors/1', rel: 'bookmark' }
        ],
        name: 'm1.tiny'
      }, {
        id: '2',
        links: [
          { href: 'http://192.168.99.99:8774/v2.1/flavors/2', rel: 'self' },
          { href: 'http://192.168.99.99:8774/flavors/2', rel: 'bookmark' }
        ],
        name: 'm1.small'
      }, {
        id: '3',
        links: [
          { href: 'http://192.168.99.99:8774/v2.1/flavors/3', rel: 'self' },
          { href: 'http://192.168.99.99:8774/flavors/3', rel: 'bookmark' }
        ],
        name: 'm1.medium'
      }, {
        id: '4',
        links: [
          { href: 'http://192.168.99.99:8774/v2.1/flavors/4', rel: 'self' },
          { href: 'http://192.168.99.99:8774/flavors/4', rel: 'bookmark' }
        ],
        name: 'm1.large'
      }, {
        id: '42',
        links: [
          { href: 'http://192.168.99.99:8774/v2.1/flavors/42', rel: 'self' },
          { href: 'http://192.168.99.99:8774/flavors/42', rel: 'bookmark' }
        ],
        name: 'm1.nano'
      }, {
        id: '5',
        links: [
          { href: 'http://192.168.99.99:8774/v2.1/flavors/5', rel: 'self' },
          { href: 'http://192.168.99.99:8774/flavors/5', rel: 'bookmark' }
        ],
        name: 'm1.xlarge'
      }, {
        id: '84',
        links: [
          { href: 'http://192.168.99.99:8774/v2.1/flavors/84', rel: 'self' },
          { href: 'http://192.168.99.99:8774/flavors/84', rel: 'bookmark' }
        ],
        name: 'm1.micro'
      }, {
        id: 'c1',
        links: [
          { href: 'http://192.168.99.99:8774/v2.1/flavors/c1', rel: 'self' },
          { href: 'http://192.168.99.99:8774/flavors/c1', rel: 'bookmark' }
        ],
        name: 'cirros256'
      }, {
        id: 'd1',
        links: [
          { href: 'http://192.168.99.99:8774/v2.1/flavors/d1', rel: 'self' },
          { href: 'http://192.168.99.99:8774/flavors/d1', rel: 'bookmark' }
        ],
        name: 'ds512M'
      }, {
        id: 'd2',
        links: [
          { href: 'http://192.168.99.99:8774/v2.1/flavors/d2', rel: 'self' },
          { href: 'http://192.168.99.99:8774/flavors/d2', rel: 'bookmark' }
        ],
        name: 'ds1G'
      }, {
        id: 'd3',
        links: [
          { href: 'http://192.168.99.99:8774/v2.1/flavors/d3', rel: 'self' },
          { href: 'http://192.168.99.99:8774/flavors/d3', rel: 'bookmark' }
        ],
        name: 'ds2G'
      }, {
        id: 'd4',
        links: [
          { href: 'http://192.168.99.99:8774/v2.1/flavors/d4', rel: 'self' },
          { href: 'http://192.168.99.99:8774/flavors/d4', rel: 'bookmark' }
        ],
        name: 'ds4G'
      }]
    }
  }
}

export {
  novaConfig as config,
  rootResponse as root,
  versionedRootResponse as rootVersion,
  flavorList
}
