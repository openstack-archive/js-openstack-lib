import OpenStack from "../../src/openstack";
import * as mockData from './helpers/data/openstack';

const FetchMock = require('fetch-mock');

describe("Simple test", () => {

  afterEach(() => {
    FetchMock.reset();
  });

  it("should export a class", () => {
    let t = new OpenStack(mockData.config);
    expect(t).toBeDefined();
  });

  it("should throw an error for an empty config", () => {
    try {
      let t = new OpenStack();
      t.getConfig();
    } catch (e) {
      expect(e.message).toEqual('A configuration is required.');
    }
  });

  it("getConfig should returns the config", () => {
    let openstack = new OpenStack(mockData.config);
    let config = openstack.getConfig();
    expect(config.region_name).toEqual('Region1');
  });

});
