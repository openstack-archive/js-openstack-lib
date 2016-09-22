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
function rootResponse() {
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

function tokenIssue() {
  return {
    method: 'POST',
    matcher: 'http://192.168.99.99/identity_v2_admin/v3/auth/tokens',
    response: {
      status: 201,
      headers: {
        'X-Subject-Token': 'test_token'
      },
      body: {
        token: {
          is_domain: false,
          methods: [
            "password"
          ],
          roles: [
            {
              id: "cfa75a8719f544e2903e5899785b0cf0",
              name: "anotherrole"
            },
            {
              id: "5f8126fad6704a999a3651955c7d8219",
              name: "Member"
            }
          ],
          is_admin_project: false,
          project: {
            domain: {
              id: "default",
              name: "Default"
            },
            id: "8b2aa635109f4d0ab355e18a269d341f",
            name: "demo"
          },
          catalog: [
            {
              endpoints: [
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99/identity_v2_admin",
                  region: "RegionOne",
                  interface: "admin",
                  id: "940664e070864b638dfafc53cfcbe887"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99/identity",
                  region: "RegionOne",
                  interface: "internal",
                  id: "c3707565bccb407c888040fa9b7e77b0"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99/identity",
                  region: "RegionOne",
                  interface: "public",
                  id: "fb28f261810449ea98b2df646b847a74"
                }
              ],
              type: "identity",
              id: "0599684d07a145659fa858c1deb4e885",
              name: "keystone"
            },
            {
              endpoints: [
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8776/v3/8b2aa635109f4d0ab355e18a269d341f",
                  region: "RegionOne",
                  interface: "internal",
                  id: "611a5108ef0b4f999ad439b0e1abd9da"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8776/v3/8b2aa635109f4d0ab355e18a269d341f",
                  region: "RegionOne",
                  interface: "public",
                  id: "ae08047e33d848c8b1c77f99bc572e22"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8776/v3/8b2aa635109f4d0ab355e18a269d341f",
                  region: "RegionOne",
                  interface: "admin",
                  id: "e26c6757baa549469772e16e03c051b8"
                }
              ],
              type: "volumev3",
              id: "1092f88a41c64fc7b0331fce96e7df6c",
              name: "cinderv3"
            },
            {
              endpoints: [
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8776/v1/8b2aa635109f4d0ab355e18a269d341f",
                  region: "RegionOne",
                  interface: "public",
                  id: "14ad1642b0874816a7ff08eb0e24be87"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8776/v1/8b2aa635109f4d0ab355e18a269d341f",
                  region: "RegionOne",
                  interface: "internal",
                  id: "8bb7b28802d44e9d80fbb358a3e133af"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8776/v1/8b2aa635109f4d0ab355e18a269d341f",
                  region: "RegionOne",
                  interface: "admin",
                  id: "c271745ff29c4c9d829ab3187d41cab7"
                }
              ],
              type: "volume",
              id: "5067360b6f264558945b7d2c312dd126",
              name: "cinder"
            },
            {
              endpoints: [
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:9292",
                  region: "RegionOne",
                  interface: "admin",
                  id: "0b8b5f0f14904136ab5a4f83f27ec49a"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:9292",
                  region: "RegionOne",
                  interface: "internal",
                  id: "97c90e43e1fe473b85ef47627006dcdd"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:9292",
                  region: "RegionOne",
                  interface: "public",
                  id: "ee114418c77a45d2a3cc28240dc4281d"
                }
              ],
              type: "image",
              id: "6512ca68fbd543928768201198cd7e42",
              name: "glance"
            },
            {
              endpoints: [
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8774/v2.1",
                  region: "RegionOne",
                  interface: "internal",
                  id: "14129d81da0e44abae0c082c535b58cc"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8774/v2.1",
                  region: "RegionOne",
                  interface: "public",
                  id: "be681632633d4a62a781148c2fedd6aa"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8774/v2.1",
                  region: "RegionOne",
                  interface: "admin",
                  id: "f8979efb0903442a9068d57fce4eafb2"
                }
              ],
              type: "compute",
              id: "6d3dd68ae2224fd39503342220b5d2c2",
              name: "nova"
            },
            {
              endpoints: [
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8774/v2/8b2aa635109f4d0ab355e18a269d341f",
                  region: "RegionOne",
                  interface: "admin",
                  id: "308f5ed663a7417db3f078f7e3b66db8"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8774/v2/8b2aa635109f4d0ab355e18a269d341f",
                  region: "RegionOne",
                  interface: "public",
                  id: "9f08e41e8156498ba01b5cc83cc9e1da"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8774/v2/8b2aa635109f4d0ab355e18a269d341f",
                  region: "RegionOne",
                  interface: "internal",
                  id: "b855d4c048f1468f9df5a9950ae811c6"
                }
              ],
              type: "compute_legacy",
              id: "8ca07a04d03145a094c404b5edf70c18",
              name: "nova_legacy"
            },
            {
              endpoints: [
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8776/v2/8b2aa635109f4d0ab355e18a269d341f",
                  region: "RegionOne",
                  interface: "internal",
                  id: "2b6e28e0aade41b5b80baa9012e54ca4"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8776/v2/8b2aa635109f4d0ab355e18a269d341f",
                  region: "RegionOne",
                  interface: "admin",
                  id: "79c96252a8ab4c7181ef4fe97237c314"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:8776/v2/8b2aa635109f4d0ab355e18a269d341f",
                  region: "RegionOne",
                  interface: "public",
                  id: "8d4cbc86845a4ecb90f19903636205a7"
                }
              ],
              type: "volumev2",
              id: "a7967e90d1044b1fa6d80b033f1da510",
              name: "cinderv2"
            },
            {
              endpoints: [
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:9696/",
                  region: "RegionOne",
                  interface: "public",
                  id: "7033fa4ebed74e3fa51753162150a1f2"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:9696/",
                  region: "RegionOne",
                  interface: "internal",
                  id: "7aa942d402a34d4c90454b9d84285855"
                },
                {
                  region_id: "RegionOne",
                  url: "http://192.168.99.99:9696/",
                  region: "RegionOne",
                  interface: "admin",
                  id: "bd8db1bafe41489bbbc45641e525ee7d"
                }
              ],
              type: "network",
              id: "f36b9e68ef114769b85024513ee61047",
              name: "neutron"
            }
          ],
          expires_at: "2016-08-19T18:04:11.157434Z",
          user: {
            domain: {
              id: "default",
              name: "Default"
            },
            id: "d56a64f45da0450a826ede637be64304",
            name: "demo"
          },
          audit_ids: [
            "FtgqCjtuR2-V36loBJ8mxQ"
          ],
          issued_at: "2016-08-19T17:04:11.157456Z"
        }
      }
    }
  };
}

function tokenRevoke(token, adminToken = null) {
  return {
    method: 'DELETE',
    matcher: 'http://192.168.99.99/identity_v2_admin/v3/auth/tokens',
    headers: {
      'X-Subject-Token': token,
      'X-Auth-Token': adminToken || token
    },
    response: {
      status: 204
    }
  };
}

function catalogList(token) {
  return {
    method: 'GET',
    matcher: 'http://192.168.99.99/identity_v2_admin/v3/auth/catalog',
    headers: {
      'X-Auth-Token': token
    },
    response: {
      catalog: [{
        endpoints: [{
          region_id: "RegionOne",
          url: "http://192.168.99.99/identity_v2_admin",
          region: "RegionOne",
          interface: "admin",
          id: "940664e070864b638dfafc53cfcbe887"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99/identity",
          region: "RegionOne",
          interface: "internal",
          id: "c3707565bccb407c888040fa9b7e77b0"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99/identity",
          region: "RegionOne",
          interface: "public",
          id: "fb28f261810449ea98b2df646b847a74"
        }], type: "identity", id: "0599684d07a145659fa858c1deb4e885", name: "keystone"
      }, {
        endpoints: [{
          region_id: "RegionOne",
          url: "http://192.168.99.99:8776/v3/8b2aa635109f4d0ab355e18a269d341f",
          region: "RegionOne",
          interface: "internal",
          id: "611a5108ef0b4f999ad439b0e1abd9da"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:8776/v3/8b2aa635109f4d0ab355e18a269d341f",
          region: "RegionOne",
          interface: "public",
          id: "ae08047e33d848c8b1c77f99bc572e22"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:8776/v3/8b2aa635109f4d0ab355e18a269d341f",
          region: "RegionOne",
          interface: "admin",
          id: "e26c6757baa549469772e16e03c051b8"
        }], type: "volumev3", id: "1092f88a41c64fc7b0331fce96e7df6c", name: "cinderv3"
      }, {
        endpoints: [{
          region_id: "RegionOne",
          url: "http://192.168.99.99:8776/v1/8b2aa635109f4d0ab355e18a269d341f",
          region: "RegionOne",
          interface: "public",
          id: "14ad1642b0874816a7ff08eb0e24be87"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:8776/v1/8b2aa635109f4d0ab355e18a269d341f",
          region: "RegionOne",
          interface: "internal",
          id: "8bb7b28802d44e9d80fbb358a3e133af"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:8776/v1/8b2aa635109f4d0ab355e18a269d341f",
          region: "RegionOne",
          interface: "admin",
          id: "c271745ff29c4c9d829ab3187d41cab7"
        }], type: "volume", id: "5067360b6f264558945b7d2c312dd126", name: "cinder"
      }, {
        endpoints: [{
          region_id: "RegionOne",
          url: "http://192.168.99.99:9292",
          region: "RegionOne",
          interface: "admin",
          id: "0b8b5f0f14904136ab5a4f83f27ec49a"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:9292",
          region: "RegionOne",
          interface: "internal",
          id: "97c90e43e1fe473b85ef47627006dcdd"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:9292",
          region: "RegionOne",
          interface: "public",
          id: "ee114418c77a45d2a3cc28240dc4281d"
        }], type: "image", id: "6512ca68fbd543928768201198cd7e42", name: "glance"
      }, {
        endpoints: [{
          region_id: "RegionOne",
          url: "http://192.168.99.99:8774/v2.1",
          region: "RegionOne",
          interface: "internal",
          id: "14129d81da0e44abae0c082c535b58cc"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:8774/v2.1",
          region: "RegionOne",
          interface: "public",
          id: "be681632633d4a62a781148c2fedd6aa"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:8774/v2.1",
          region: "RegionOne",
          interface: "admin",
          id: "f8979efb0903442a9068d57fce4eafb2"
        }], type: "compute", id: "6d3dd68ae2224fd39503342220b5d2c2", name: "nova"
      }, {
        endpoints: [{
          region_id: "RegionOne",
          url: "http://192.168.99.99:8774/v2/8b2aa635109f4d0ab355e18a269d341f",
          region: "RegionOne",
          interface: "admin",
          id: "308f5ed663a7417db3f078f7e3b66db8"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:8774/v2/8b2aa635109f4d0ab355e18a269d341f",
          region: "RegionOne",
          interface: "public",
          id: "9f08e41e8156498ba01b5cc83cc9e1da"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:8774/v2/8b2aa635109f4d0ab355e18a269d341f",
          region: "RegionOne",
          interface: "internal",
          id: "b855d4c048f1468f9df5a9950ae811c6"
        }], type: "compute_legacy", id: "8ca07a04d03145a094c404b5edf70c18", name: "nova_legacy"
      }, {
        endpoints: [{
          region_id: "RegionOne",
          url: "http://192.168.99.99:8776/v2/8b2aa635109f4d0ab355e18a269d341f",
          region: "RegionOne",
          interface: "internal",
          id: "2b6e28e0aade41b5b80baa9012e54ca4"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:8776/v2/8b2aa635109f4d0ab355e18a269d341f",
          region: "RegionOne",
          interface: "admin",
          id: "79c96252a8ab4c7181ef4fe97237c314"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:8776/v2/8b2aa635109f4d0ab355e18a269d341f",
          region: "RegionOne",
          interface: "public",
          id: "8d4cbc86845a4ecb90f19903636205a7"
        }], type: "volumev2", id: "a7967e90d1044b1fa6d80b033f1da510", name: "cinderv2"
      }, {
        endpoints: [{
          region_id: "RegionOne",
          url: "http://192.168.99.99:9696/",
          region: "RegionOne",
          interface: "public",
          id: "7033fa4ebed74e3fa51753162150a1f2"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:9696/",
          region: "RegionOne",
          interface: "internal",
          id: "7aa942d402a34d4c90454b9d84285855"
        }, {
          region_id: "RegionOne",
          url: "http://192.168.99.99:9696/",
          region: "RegionOne",
          interface: "admin",
          id: "bd8db1bafe41489bbbc45641e525ee7d"
        }], type: "network", id: "f36b9e68ef114769b85024513ee61047", name: "neutron"
      }]
    }
  };
}

export {
  cloudConfig as config,
  rootResponse as root,
  tokenIssue as tokenIssue,
  tokenRevoke as tokenRevoke,
  catalogList,
};
