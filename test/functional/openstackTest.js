import config from "./helpers/cloudsConfig";
import OpenStack from "../../src/openstack";
import log from 'loglevel';

log.setLevel("DEBUG");

describe("OpenStack", () => {
  let devstackConfig = config.clouds.devstack;

  describe("networkList()", () => {
    it("should return the networks as an array.", (done) => {
      const openstack = new OpenStack(devstackConfig);

      openstack.networkList()
        .then((networks) => {
          expect(networks.length > 0).toBeTruthy();
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

});
