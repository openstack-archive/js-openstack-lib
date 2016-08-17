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
const cloudConfig = {
  region_name: 'Region1',
  auth: {
    username: 'user',
    password: 'pass',
    project_name: 'js-openstack-lib',
    auth_url: 'http://192.168.99.99/'
  }
};

/**
 * Build a new FetchMock configuration for the root endpoint.
 *
 * @returns {{}} A full FetchMock configuration for Keystone's Root Resource.
 */
function rootResponse () {
  return {
    method: 'GET',
    matcher: 'http://192.168.99.99/',
    response: {
      versions: {
        values: [
          {
            status: "stable",
            updated: "2016-10-06T00:00:00Z",
            "media-types": [
              {
                base: "application/json",
                type: "application/vnd.openstack.identity-v3+json"
              }
            ],
            id: "v3.7",
            links: [
              {
                href: "http://docs.openstack.org/",
                type: "text/html",
                rel: "describedby"
              },
              {
                href: "http://192.168.99.99/identity_v2_admin/v3/",
                rel: "self"
              }
            ]
          },
          {
            status: "deprecated",
            updated: "2016-08-04T00:00:00Z",
            "media-types": [
              {
                base: "application/json",
                type: "application/vnd.openstack.identity-v2.0+json"
              }
            ],
            id: "v2.0",
            links: [
              {
                href: "http://192.168.99.99/identity_v2_admin/v2.0/",
                rel: "self"
              },
              {
                href: "http://docs.openstack.org/",
                type: "text/html",
                rel: "describedby"
              }
            ]
          }
        ]
      }
    }
  };
}

export {
  cloudConfig as config,
  rootResponse as root
};
