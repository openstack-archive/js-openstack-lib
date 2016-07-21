import Test from "../../src/index";
import config from "./helpers/cloudsConfig";

describe("Simple functional test", () => {

  it("should call keystone URL", (done) => {
    const testKeystone = function(response) {
      expect(response.status).toBe(200);
      done();
    };

    const failTest = function(error) {
      expect(error).toBeUndefined();
      done();
    };

    const t = new Test();
    t.getUrl(config.clouds.devstack.auth.auth_url + '/v2.0')
      .then(testKeystone)
      .catch(failTest);
  });

});
