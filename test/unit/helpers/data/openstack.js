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
 * openstack class.
 */

/**
 * Mock cloud configuration that matches our test data below. This is not a full clouds.yaml
 * format, rather just the subsection pointing to a particular cloud.
 * @param {String} regionName A region name to use
 * @returns {{}} a cloud config object.
 */
function cloudConfig (regionName = 'RegionOne') {
  return {
    region_name: regionName,
    auth: {
      username: 'user',
      password: 'pass',
      project_name: 'js-openstack-lib',
      auth_url: 'http://192.168.99.99/'
    }
  }
}

export {
  cloudConfig as config
}
