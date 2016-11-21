import OpenStack from "../../src/openstack";
import * as openStackMockData from './helpers/data/openstack';
import * as neutronMockData from './helpers/data/neutron';
import * as keystoneMockData from './helpers/data/keystone';
import * as glanceMockData from './helpers/data/glance';
import fetchMock from 'fetch-mock';
import Neutron from "../../src/neutron";
import Keystone from "../../src/keystone";
import Glance from "../../src/glance";

describe("Simple test", () => {

  afterEach(fetchMock.restore);

  it("should export a class", () => {
    let t = new OpenStack(openStackMockData.config());
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
    let openstack = new OpenStack(openStackMockData.config());
    let config = openstack.getConfig();
    expect(config.region_name).toEqual('RegionOne');
  });

  describe('networkList', () => {
    it('should fetch networkList from neutron', (done) => {
      const openstack = new OpenStack(openStackMockData.config());
      const neutron = mockNeutron(openstack);
      const networksData = neutronMockData.networkList('token').response.networks;

      spyOn(neutron, 'networkList').and.returnValue(Promise.resolve(networksData));

      openstack.networkList()
        .then((networks) => {
          expect(networks.length).toBe(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe('imageList', () => {
    it('should fetch imageList from glance', (done) => {
      const openstack = new OpenStack(openStackMockData.config());
      const glance = mockGlance(openstack);
      const imagesData = glanceMockData.imageList('token').response.images;

      spyOn(glance, 'imageList').and.returnValue(Promise.resolve(imagesData));

      openstack.imageList()
        .then((images) => {
          expect(images.length).toBe(3);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe('_neutron', () => {
    it('creates Neutron instance with the correct endpoint', (done) => {
      const token = 'test_token';
      const openstack = new OpenStack(openStackMockData.config());
      const keystone = mockKeystone(openstack);
      const catalogData = keystoneMockData.catalogList(token).response.catalog;

      spyOn(keystone, 'tokenIssue').and.returnValue(Promise.resolve(token));
      spyOn(keystone, 'catalogList').and.returnValue(Promise.resolve(catalogData));

      openstack._neutron
        .then((neutron) => {
          expect(keystone.catalogList).toHaveBeenCalledWith(token);
          expect(neutron).toEqual(jasmine.any(Neutron));
          expect(neutron.endpointUrl).toEqual('http://192.168.99.99:9696/');
          done();
        })
        .catch((error) => done.fail(error));
    });

    it('creates Neutron instance for the correct endpoint', (done) => {
      const token = 'test_token';
      const openstack = new OpenStack(openStackMockData.config('RegionTwo'));
      const keystone = mockKeystone(openstack);
      const catalogData = keystoneMockData.catalogList(token).response.catalog;

      spyOn(keystone, 'tokenIssue').and.returnValue(Promise.resolve(token));
      spyOn(keystone, 'catalogList').and.returnValue(Promise.resolve(catalogData));

      openstack._neutron
        .then((neutron) => {
          expect(neutron).toEqual(jasmine.any(Neutron));
          expect(neutron.endpointUrl).toEqual('http://192.168.99.100:9696/');
          done();
        })
        .catch((error) => done.fail(error));
    });

    it('should cache Neutron instance and Keystone token', (done) => {
      const openstack = new OpenStack(openStackMockData.config());
      const tokenIssueMock = keystoneMockData.tokenIssue();
      const catalogListMock = keystoneMockData.catalogList('test_token');

      fetchMock.mock(keystoneMockData.root());
      fetchMock.mock(tokenIssueMock);
      fetchMock.mock(catalogListMock);

      openstack._neutron
        .then((neutron) => {
          expect(neutron).toEqual(jasmine.any(Neutron));
          expect(fetchMock.calls(tokenIssueMock.matcher).length).toEqual(1);
          expect(fetchMock.calls(catalogListMock.matcher).length).toEqual(1);
          return openstack._neutron;
        })
        .then((neutron) => {
          expect(neutron).toEqual(jasmine.any(Neutron));
          expect(fetchMock.calls(tokenIssueMock.matcher).length).toEqual(1);
          expect(fetchMock.calls(catalogListMock.matcher).length).toEqual(1);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe('_glance', () => {
    it('creates Glance instance with the correct endpoint', (done) => {
      const token = 'test_token';
      const openstack = new OpenStack(openStackMockData.config());
      const keystone = mockKeystone(openstack);
      const catalogData = keystoneMockData.catalogList(token).response.catalog;

      spyOn(keystone, 'tokenIssue').and.returnValue(Promise.resolve(token));
      spyOn(keystone, 'catalogList').and.returnValue(Promise.resolve(catalogData));

      openstack._glance
        .then((glance) => {
          expect(keystone.catalogList).toHaveBeenCalledWith(token);
          expect(glance).toEqual(jasmine.any(Glance));
          expect(glance.endpointUrl).toEqual('http://192.168.99.99:9292');
          done();
        })
        .catch((error) => done.fail(error));
    });

    it('should cache Glance instance and Keystone token', (done) => {
      const openstack = new OpenStack(openStackMockData.config());
      const tokenIssueMock = keystoneMockData.tokenIssue();
      const catalogListMock = keystoneMockData.catalogList('test_token');

      fetchMock.mock(keystoneMockData.root());
      fetchMock.mock(tokenIssueMock);
      fetchMock.mock(catalogListMock);

      openstack._glance
        .then((glance) => {
          expect(glance).toEqual(jasmine.any(Glance));
          expect(fetchMock.calls(tokenIssueMock.matcher).length).toEqual(1);
          expect(fetchMock.calls(catalogListMock.matcher).length).toEqual(1);
          return openstack._glance;
        })
        .then((glance) => {
          expect(glance).toEqual(jasmine.any(Glance));
          expect(fetchMock.calls(tokenIssueMock.matcher).length).toEqual(1);
          expect(fetchMock.calls(catalogListMock.matcher).length).toEqual(1);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe('_token', () => {
    it('should fetch the token and cache it', (done) => {
      const openstack = new OpenStack(openStackMockData.config());
      const keystone = mockKeystone(openstack);

      spyOn(keystone, 'tokenIssue').and.returnValue(Promise.resolve('test_token'));

      openstack._token
        .then((token) => {
          expect(token).toEqual('test_token');
          expect(keystone.tokenIssue.calls.count()).toEqual(1);
          return openstack._token;
        })
        .then((token) => {
          expect(token).toEqual('test_token');
          expect(keystone.tokenIssue.calls.count()).toEqual(1);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  function mockKeystone(openstack) {
    const keystone = new Keystone(keystoneMockData.config);
    openstack._keystonePromise = Promise.resolve(keystone);
    return keystone;
  }

  function mockNeutron(openstack) {
    const neutron = new Neutron(neutronMockData.config);
    openstack._neutronPromise = Promise.resolve(neutron);
    return neutron;
  }

  function mockGlance(openstack) {
    const glance = new Glance(glanceMockData.config);
    openstack._glancePromise = Promise.resolve(glance);
    return glance;
  }

});
