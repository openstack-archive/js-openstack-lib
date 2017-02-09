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
function rootResponse() {
  return {
    method: 'GET',
    matcher: 'http://192.168.99.99:9292/',
    response: {
      versions: [
        {
          status: "CURRENT",
          id: "v2.5",
          links: [
            {
              href: "http://192.168.99.99:9292/v2/",
              rel: "self"
            }
          ]
        },
        {
          status: "SUPPORTED",
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

function imageList(token) {
  return {
    method: 'GET',
    matcher: 'http://192.168.99.99:9292/v2/images',
    headers: {
      'X-Auth-Token': token
    },
    response: {
      images: [
        {
          status: 'active',
          name: 'cirros-0.3.4-x86_64-uec',
          tags: [],
          kernel_id: '7c26de84-1ad7-4851-aea5-5c173d0605c8',
          container_format: 'ami',
          created_at: '2016-08-26T17:16:10Z',
          ramdisk_id: '3ac21034-3764-407a-baab-966db753e3e5',
          disk_format: 'ami',
          updated_at: '2016-08-26T17:16:10Z',
          visibility: 'public',
          self: '/v2/images/8f3c7c9a-d812-46b1-9223-aa2d8f12c10a',
          min_disk: 0,
          protected: false,
          id: '8f3c7c9a-d812-46b1-9223-aa2d8f12c10a',
          size: 25165824,
          file: '/v2/images/8f3c7c9a-d812-46b1-9223-aa2d8f12c10a/file',
          checksum: 'eb9139e4942121f22bbc2afc0400b2a4',
          owner: 'fcfe212681764e0595df8df83fd019f6',
          virtual_size: null,
          min_ram: 0,
          schema: '/v2/schemas/image'
        },
        {
          status: 'active',
          name: 'cirros-0.3.4-x86_64-uec-ramdisk',
          tags: [],
          container_format: 'ari',
          created_at: '2016-08-26T17:16:09Z',
          size: 3740163,
          disk_format: 'ari',
          updated_at: '2016-08-26T17:16:09Z',
          visibility: 'public',
          self: '/v2/images/3ac21034-3764-407a-baab-966db753e3e5',
          min_disk: 0,
          protected: false,
          id: '3ac21034-3764-407a-baab-966db753e3e5',
          file: '/v2/images/3ac21034-3764-407a-baab-966db753e3e5/file',
          checksum: 'be575a2b939972276ef675752936977f',
          owner: 'fcfe212681764e0595df8df83fd019f6',
          virtual_size: null,
          min_ram: 0,
          schema: '/v2/schemas/image'
        },
        {
          status: 'active',
          name: 'cirros-0.3.4-x86_64-uec-kernel',
          tags: [],
          container_format: 'aki',
          created_at: '2016-08-26T17:16:08Z',
          size: 4979632,
          disk_format: 'aki',
          updated_at: '2016-08-26T17:16:08Z',
          visibility: 'public',
          self: '/v2/images/7c26de84-1ad7-4851-aea5-5c173d0605c8',
          min_disk: 0,
          protected: false,
          id: '7c26de84-1ad7-4851-aea5-5c173d0605c8',
          file: '/v2/images/7c26de84-1ad7-4851-aea5-5c173d0605c8/file',
          checksum: '8a40c862b5735975d82605c1dd395796',
          owner: 'fcfe212681764e0595df8df83fd019f6',
          virtual_size: null,
          min_ram: 0,
          schema: '/v2/schemas/image'
        }],
      schema: '/v2/schemas/images',
      first: '/v2/images'
    }
  };
}
export {
  glanceConfig as config,
  rootResponse as root,
  imageList
};
