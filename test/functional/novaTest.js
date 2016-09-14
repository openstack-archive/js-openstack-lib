/*
 * Copyright (c) 2016 Michael Krotscheck.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import config from "./helpers/cloudsConfig";
import Version from '../../src/util/version';
import Nova from "../../src/nova";
import Keystone from "../../src/keystone";
import log from 'loglevel';

log.setLevel("DEBUG");

describe("Nova", () => {
  // Create a keystone instance and extract the nova API endpoint.
  let devstackConfig = config.clouds.devstack;
  let keystone = new Keystone(devstackConfig);
  let tokenPromise = keystone.tokenIssue();

  let configPromise = tokenPromise
    .then((token) => keystone.catalogList(token))
    .then((catalog) => catalog.find((entry) => entry.name === 'nova'))
    .then((entry) => entry.endpoints.find((endpoint) => endpoint.interface === 'public'));

  describe("version()", () => {
    const supportedApiVersions = [
      new Version('2.1')
    ];

    /**
     * This test acts as a canary, to inform the SDK developers that the Nova API
     * has changed in a significant way.
     */
    it("should return a supported version.", (done) => {
      configPromise
        .then((config) => new Nova(config))
        .then((nova) => nova.version())
        .then((apiVersion) => {
          let found = supportedApiVersions.find((item) => item.equals(apiVersion));
          expect(found).not.toBeFalsy();
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("flavorList()", () => {

    /**
     * Assert that we can get a list of flavors.
     */
    it("should return a list of flavors.", (done) => {
      configPromise
        .then((config) => new Nova(config))
        .then((nova) => nova.flavorList(tokenPromise))
        .then((flavors) => {
          expect(flavors.length > 0).toBeTruthy();
          done();
        })
        .catch((error) => done.fail(error));
    });
  });
});
