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
        .catch((error) => done.fail(error));
    });
  });

  describe("version()", () => {

    const supportedApiVersions = [
      new Version('identity 3.7')
    ];

    /**
     * This test acts as a canary, to inform the SDK developers that the Keystone API
     * has changed in a significant way.
     */
    it("should return a supported version.", (done) => {
      keystone.version()
        .then((version) => {

          // Quick sanity check.
          const apiVersion = new Version('identity', version.id);

          for (let i = 0; i < supportedApiVersions.length; i++) {
            let supportedVersion = supportedApiVersions[i];
            if (apiVersion.equals(supportedVersion)) {
              done();
              return;
            }
          }
          fail("Current devstack keystone version is not supported.");
          done();
        })
        .catch((error) => done.fail(error));
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
        .catch((error) => {
          // Fail this test.
          expect(error).toBeNull();
          done();
        });
    });

    it("should permit passing your own user, password, and project.", (done) => {
      keystone
        .tokenIssue(
          adminConfig.auth.username,
          adminConfig.auth.password,
          adminConfig.auth.project_name,
          adminConfig.auth.user_domain_id,
          adminConfig.auth.project_domain_id)
        .then((token) => {
          expect(token).not.toBeNull();
          done();
        })
        .catch((error) => {
          // Fail this test.
          expect(error).toBeNull();
          done();
        });
    });

    it("should throw an exception if invalid credentials are provided.", (done) => {
      keystone
        .tokenIssue('foo', 'bar', 'lolProject', 'notADomain', 'notADomain')
        .then((token) => {
          // Fail this test.
          expect(token).toBeNull();
          done();
        })
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
        .catch((error) => done.fail(error));
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
        .catch((error) => done.fail(error));
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
          .catch((error) => done.fail(error));
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
});
