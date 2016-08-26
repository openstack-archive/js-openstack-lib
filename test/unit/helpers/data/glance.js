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
 * keystone. Most of these are functions, as FetchMock does not perform a safe clone of the
 * instances, and may accidentally modify them at runtime.
 */

/**
 * Mock cloud configuration that matches our test data below. This is not a full clouds.yaml
 * format, rather just the subsection pointing to a particular cloud.
 */
const glanceConfig = {
  region_id: "RegionOne",
  url: "http://192.168.99.99:9292/",
  region: "RegionOne",
  interface: "public",
  id: "0b8b5f0f14904136ab5a4f83f27ec49a"
};

/**
 * Build a new FetchMock configuration for the root endpoint.
 *
 * @returns {{}} A full FetchMock configuration for Glance's Root Resource.
 */
function rootResponse () {
  return {
    method: 'GET',
    matcher: 'http://192.168.99.99:9292/',
    response: {
      versions: [
        {
          status: "CURRENT",
          id: "v2.3",
          links: [
            {
              href: "http://192.168.99.99:9292/v2/",
              rel: "self"
            }
          ]
        },
        {
          status: "SUPPORTED",
          id: "v2.2",
          links: [
            {
              href: "http://192.168.99.99:9292/v2/",
              rel: "self"
            }
          ]
        },
        {
          status: "SUPPORTED",
          id: "v2.1",
          links: [
            {
              href: "http://192.168.99.99:9292/v2/",
              rel: "self"
            }
          ]
        },
        {
          status: "SUPPORTED",
          id: "v2.0",
          links: [
            {
              href: "http://192.168.99.99:9292/v2/",
              rel: "self"
            }
          ]
        },
        {
          status: "SUPPORTED",
          id: "v1.1",
          links: [
            {
              href: "http://192.168.99.99:9292/v1/",
              rel: "self"
            }
          ]
        },
        {
          status: "SUPPORTED",
          id: "v1.0",
          links: [
            {
              href: "http://192.168.99.99:9292/v1/",
              rel: "self"
            }
          ]
        }
      ]
    }
  };
}

export {
  glanceConfig as config,
  rootResponse as root
};
