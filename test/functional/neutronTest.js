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

import config from "./helpers/cloudsConfig";
import Version from '../../src/util/version';
import Neutron from "../../src/neutron";
import Keystone from "../../src/keystone";
import log from 'loglevel';

log.setLevel("DEBUG");

describe("neutron", () => {
  // Create a keystone instance and extract the neutron API endpoint.
  let devstackConfig = config.clouds.devstack;
  let keystone = new Keystone(devstackConfig);
  let tokenPromise = keystone.tokenIssue();

  let configPromise = tokenPromise
    .then((token) => keystone.catalogList(token))
    .then((catalog) => catalog.find((entry) => entry.name === 'neutron'))
    .then((entry) => entry.endpoints.find((endpoint) => endpoint.interface === 'public'));

  describe("versions()", () => {
    it("should return a list of all versions available on this clouds' neutron", (done) => {
      configPromise
        .then((config) => new Neutron(config))
        .then((neutron) => neutron.versions())
        .then((versions) => {
          // Quick sanity check.
          expect(versions.length > 0).toBeTruthy();
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("version()", () => {
    /**
     * This test acts as a canary, to inform the SDK developers that the Neutron API
     * has changed in a significant way.
     */
    it("should return a supported version.", (done) => {
      configPromise
        .then((config) => new Neutron(config))
        .then((neutron) => neutron.version())
        .then((apiVersion) => {
          expect(apiVersion instanceof Version).not.toBeFalsy();
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("networkList()", () => {
    it("should return the networks as an array.", (done) => {
      configPromise
        .then((config) => new Neutron(config))
        .then((neutron) => neutron.networkList(tokenPromise))
        .then((networks) => {
          expect(networks.length > 0).toBeTruthy();
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

});
