/*
 * Copyright (c) 2016 Internap.
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
 * neutron. Most of these are functions, as FetchMock does not perform a safe clone of the
 * instances, and may accidentally modify them at runtime.
 */

/**
 * Mock cloud configuration that matches our test data below. This is not a clouds.yaml
 * format but a subsection of service endpoint return by keystone's catalog.
 */
const neutronConfig = {
  region_id: 'RegionOne',
  url: 'http://192.168.99.99:9696/',
  region: 'RegionOne',
  interface: 'public',
  id: '0b8b5f0f14904136ab5a4f83f27ec49a'
}

/**
 * Build a new FetchMock configuration for the root endpoint.
 *
 * @returns {{}} A full FetchMock configuration for Neutron's Root Resource.
 */
function rootResponse () {
  return {
    method: 'GET',
    matcher: 'http://192.168.99.99:9696/',
    response: {
      versions: [
        {
          status: 'CURRENT',
          id: 'v2.0',
          links: [
            {
              href: 'http://192.168.99.99:9696/v2.0',
              rel: 'self'
            }
          ]
        }
      ]
    }
  }
}

function networkList (token) {
  return {
    method: 'GET',
    matcher: 'http://192.168.99.99:9696/v2.0/networks',
    headers: {
      'X-Auth-Token': token
    },
    response: {
      networks: [
        {
          status: 'ACTIVE',
          subnets: [
            '54d6f61d-db07-451c-9ab3-b9609b6b6f0b'
          ],
          name: 'private-network',
          'provider:physical_network': null,
          admin_state_up: true,
          tenant_id: '4fd44f30292945e481c7b8a0c8908869',
          qos_policy_id: '6a8454ade84346f59e8d40665f878b2e',
          'provider:network_type': 'local',
          'router:external': true,
          mtu: 0,
          shared: true,
          id: 'd32019d3-bc6e-4319-9c1d-6722fc136a22',
          'provider:segmentation_id': null
        },
        {
          status: 'ACTIVE',
          subnets: [
            '08eae331-0402-425a-923c-34f7cfe39c1b'
          ],
          name: 'private',
          'provider:physical_network': null,
          admin_state_up: true,
          tenant_id: '26a7980765d0414dbc1fc1f88cdb7e6e',
          qos_policy_id: 'bfdb6c39f71e4d44b1dfbda245c50819',
          'provider:network_type': 'local',
          'router:external': true,
          mtu: 0,
          shared: true,
          id: 'db193ab3-96e3-4cb3-8fc5-05f4296d0324',
          'provider:segmentation_id': null
        }
      ]
    }
  }
}

export {
  neutronConfig as config,
  rootResponse as root,
  networkList
}
