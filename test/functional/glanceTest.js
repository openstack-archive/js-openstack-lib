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

import config from "./helpers/cloudsConfig";
import Version from '../../src/util/version';
import Glance from "../../src/glance";
import Keystone from "../../src/keystone";
import log from 'loglevel';

log.setLevel("DEBUG");

describe("Glance", () => {
  // Create a keystone instance and extract the glance API endpoint.
  let devstackConfig = config.clouds.devstack;
  let keystone = new Keystone(devstackConfig);
  let tokenPromise = keystone.tokenIssue();

  let configPromise = tokenPromise
    .then((token) => keystone.catalogList(token))
    .then((catalog) => catalog.find((entry) => entry.name === 'glance'))
    .then((entry) => entry.endpoints.find((endpoint) => endpoint.interface === 'public'));

  describe("versions()", () => {
    it("should return a list of all versions available on this clouds' glance", (done) => {
      configPromise
        .then((config) => new Glance(config))
        .then((glance) => glance.versions())
        .then((versions) => {
          // Quick sanity check.
          expect(versions.length > 0).toBeTruthy();
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("version()", () => {

    const supportedApiVersions = [
      new Version('image 2.3')
    ];

    /**
     * This test acts as a canary, to inform the SDK developers that the Glance API
     * has changed in a significant way.
     */
    it("should return a supported version.", (done) => {
      configPromise
        .then((config) => new Glance(config))
        .then((glance) => glance.version())
        .then((version) => {

          // Quick sanity check.
          const apiVersion = new Version('image', version.id);

          for (let i = 0; i < supportedApiVersions.length; i++) {
            let supportedVersion = supportedApiVersions[i];
            if (apiVersion.equals(supportedVersion)) {
              done();
              return;
            }
          }
          fail("Current devstack glance version is not supported.");
          done();
        })
        .catch((error) => done.fail(error));
    });
  });
});
