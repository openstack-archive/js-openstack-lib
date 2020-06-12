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

import Version from '../../src/util/version';
import Keystone from "../../src/keystone";
import config from "./helpers/cloudsConfig";
import log from 'loglevel';

log.setLevel("DEBUG");

describe("Keystone", () => {
  let devstackConfig = config.clouds.devstack;
  let adminConfig = config.clouds['devstack-admin'];
  let keystone = new Keystone(devstackConfig);

  describe("versions()", () => {
    it("should return a list of all versions available on this clouds' keystone", (done) => {
      keystone.versions()
        .then((versions) => {
          // Quick sanity check.
          expect(versions.length > 0).toBeTruthy();
          done();
        })
        .catch((response) => response.json()
          .then((body) => done.fail(JSON.stringify(body)))
        );
    });
  });

  describe("version()", () => {
    /**
     * This test acts as a canary, to inform the SDK developers that the Keystone API
     * has changed in a significant way.
     */
    it("should return a supported version.", (done) => {
      keystone.version()
        .then((apiVersion) => {
          expect(apiVersion instanceof Version).not.toBeFalsy();
          done();
        })
        .catch((response) => response.json()
          .then((body) => done.fail(JSON.stringify(body)))
        );
    });
  });

  describe("tokenIssue()", () => {
    let keystone = null;

    beforeEach(() => {
      keystone = new Keystone(config.clouds.devstack);
    });

    it("should 'just work' by using provided credentials from the config.", (done) => {
      keystone
        .tokenIssue()
        .then((token) => {
          expect(token).not.toBeNull();
          done();
        })
        .catch((response) => response.json()
          .then((body) => done.fail(JSON.stringify(body)))
        );
    });

    it("should permit passing your own user, password, and project.", (done) => {
      keystone
        .tokenIssue(adminConfig.auth)
        .then((token) => {
          expect(token).not.toBeNull();
          done();
        })
        .catch((response) => response.json()
          .then((body) => done.fail(JSON.stringify(body)))
        );
    });

    it("should throw an exception if invalid username and password are provided.", (done) => {
      keystone
        .tokenIssue({
          username: 'foo',
          password: 'bar'
        })
        .then((token) => done.fail(token))
        .catch((error) => {
          expect(error).not.toBeNull();
          done();
        });
    });

    it("should throw an exception if invalid project is provided.", (done) => {
      keystone
        .tokenIssue({
          project_id: 'foo',
          project_name: 'bar'
        })
        .then((token) => done.fail(token))
        .catch((error) => {
          expect(error).not.toBeNull();
          done();
        });
    });

    it("should throw an exception if invalid user domain is provided.", (done) => {
      keystone
        .tokenIssue({
          user_domain_id: 'foo',
          user_domain_name: 'bar'
        })
        .then((token) => done.fail(token))
        .catch((error) => {
          expect(error).not.toBeNull();
          done();
        });
    });
  });

  describe("tokenRevoke()", () => {
    let keystone = null;

    beforeEach(() => {
      keystone = new Keystone(config.clouds.devstack);
    });

    it("should permit self-revocation.", (done) => {
      keystone
        .tokenIssue()
        .then((token) => {
          return keystone.tokenRevoke(token);
        })
        .then((response) => {
          expect(response.status).toBe(204); // No content
          done();
        })
        .catch((response) => response.json()
          .then((body) => done.fail(JSON.stringify(body)))
        );
    });

    it("should allow an admin to revoke another token.", (done) => {
      let adminToken;
      let adminKeystone = new Keystone(adminConfig);

      adminKeystone.tokenIssue() // Get an admin token.
        .then((token) => {
          adminToken = token;
          return keystone.tokenIssue(); // Regular token.
        })
        .then((token) => keystone.tokenRevoke(token, adminToken))
        .then((response) => {
          expect(response.status).toBe(204); // No content
          done();
        })
        .catch((response) => response.json()
          .then((body) => done.fail(JSON.stringify(body)))
        );
    });

    it("should throw an exception if invalid token is provided.", (done) => {
      keystone
        .tokenRevoke('not_a_valid_token')
        .then((response) => done.fail(response))
        .catch((error) => {
          expect(error).not.toBeNull();
          done();
        });
    });
  });

  describe("tokenInfo()", () => {
    let keystone = null;

    beforeEach(() => {
      keystone = new Keystone(config.clouds.devstack);
    });

    it("should retrieve info about a token.", (done) => {
      keystone
        .tokenIssue()
        .then((token) => {
          return keystone.tokenInfo(token);
        })
        .then((info) => {
          expect('token' in info).toBe(true);
          done();
        })
        .catch((response) => response.json()
          .then((body) => done.fail(JSON.stringify(body)))
        );
    });

    it("should throw an exception if invalid token is provided.", (done) => {
      keystone
        .tokenRevoke('not_a_valid_token')
        .then((response) => done.fail(response))
        .catch((error) => {
          expect(error).not.toBeNull();
          done();
        });
    });
  });

  describe("catalogList()", () => {
    let keystone = null;

    beforeEach(() => {
      keystone = new Keystone(config.clouds.devstack);
    });

    it("should list a catalog.", (done) => {
      keystone
        .tokenIssue()
        .then((token) => {
          return keystone.catalogList(token);
        })
        .then((catalog) => {
          expect(catalog.length).not.toBe(0);
          done();
        })
        .catch((response) => response.json()
          .then((body) => done.fail(JSON.stringify(body)))
        );
    });

    it("should error if not authenticated.", (done) => {
      keystone
        .catalogList()
        .then((response) => done.fail(response))
        .catch((error) => {
          expect(error).not.toBeNull();
          done();
        });
    });
  });
});
