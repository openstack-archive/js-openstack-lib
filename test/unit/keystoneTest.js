import Keystone from '../../src/keystone.js';
import * as mockData from './helpers/data/keystone';
import fetchMock from 'fetch-mock';

describe('Keystone', () => {

  afterEach(fetchMock.restore);

  it('should export a class', () => {
    const keystone = new Keystone(mockData.config);
    expect(keystone).toBeDefined();
  });

  it('should throw an error for an empty config', () => {
    try {
      const keystone = new Keystone();
      keystone.authenticate();
    } catch (e) {
      expect(e.message).toEqual('A configuration is required.');
    }
  });

  it('should authenticate', (done) => {
    const authUrl = "http://192.168.99.99/identity_v2_admin/v3/";
    fetchMock.mock(mockData.root());

    fetchMock
      .post(authUrl, {
        body: {
          catalog: {
            foo: 'bar'
          }
        },
        headers: {
          'X-Subject-Token': 'the-token'
        }
      });

    const keystone = new Keystone(mockData.config);

    keystone.authenticate()
      .then(() => {
        expect(fetchMock.called(authUrl)).toEqual(true);
        expect(typeof keystone.token).toEqual('string');
        expect(keystone.token).toEqual('the-token');
        expect(keystone.catalog).toEqual({foo: 'bar'});
        done();
      })
      .catch((reason) => {
        expect(reason).toBeUndefined();
        done();
      });
  });

  describe("versions()", () => {
    it("Should return a list of all versions available on this clouds' keystone", (done) => {
      const keystone = new Keystone(mockData.config);

      fetchMock.mock(mockData.root());

      keystone.versions()
        .then((versions) => {
          // Quick sanity check.
          expect(versions.length).toBe(2);
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should NOT cache its results", (done) => {
      const keystone = new Keystone(mockData.config);
      const mockOptions = mockData.root();

      fetchMock.mock(mockOptions);

      keystone.versions()
        .then(() => {
          // Validate that the mock has only been invoked once
          expect(fetchMock.calls(mockOptions.name).length).toEqual(1);
          return keystone.versions();
        })
        .then(() => {
          expect(fetchMock.calls(mockOptions.name).length).toEqual(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("version()", () => {

    it("Should return a supported version of the keystone API.", (done) => {
      const keystone = new Keystone(mockData.config);

      fetchMock.mock(mockData.root());

      keystone.version()
        .then((version) => {
          expect(version.id).toEqual('v3.7');
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should throw an exception if no supported version is found.", (done) => {
      const keystone = new Keystone(mockData.config);

      // Build an invalid mock object.
      const mockOptions = mockData.root();
      mockOptions.response.versions.values.shift();

      fetchMock.mock(mockOptions);

      keystone.version()
        .then((response) => done.fail(response))
        .catch((error) => {
          expect(error).not.toBeNull();
          done();
        });
    });

    it("Should NOT cache its results", (done) => {
      const keystone = new Keystone(mockData.config);
      const mockOptions = mockData.root();
      fetchMock.mock(mockOptions);

      keystone.version()
        .then(() => {
          // Validate that the mock has only been invoked once
          expect(fetchMock.calls(mockOptions.name).length).toEqual(1);
          return keystone.version();
        })
        .then(() => {
          expect(fetchMock.calls(mockOptions.name).length).toEqual(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("serviceEndpoint()", () => {

    it("Should return a valid endpoint to the keystone API.", (done) => {
      const keystone = new Keystone(mockData.config);

      fetchMock.mock(mockData.root());

      keystone.serviceEndpoint()
        .then((endpoint) => {
          expect(endpoint).toEqual('http://192.168.99.99/identity_v2_admin/v3/');
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should throw an exception if no endpoint is provided.", (done) => {
      const keystone = new Keystone(mockData.config);

      // Build an exception payload.
      const mockOptions = JSON.parse(JSON.stringify(mockData.root()));
      mockOptions.response.versions.values[0].links = [];
      fetchMock.mock(mockOptions);

      keystone.serviceEndpoint()
        .then((response) => done.fail(response))
        .catch((error) => {
          expect(error).not.toBeNull();
          done();
        });
    });

    it("Should throw an exception if no links array exists.", (done) => {
      const keystone = new Keystone(mockData.config);

      // Build an exception payload.
      const mockOptions = JSON.parse(JSON.stringify(mockData.root()));
      delete mockOptions.response.versions.values[0].links;
      fetchMock.mock(mockOptions);

      keystone.serviceEndpoint()
        .then((response) => done.fail(response))
        .catch((error) => {
          expect(error).not.toBeNull();
          done();
        });
    });

    it("Should cache its results", (done) => {
      const keystone = new Keystone(mockData.config);
      const mockOptions = mockData.root();
      fetchMock.mock(mockOptions);

      keystone.serviceEndpoint()
        .then(() => {
          // Validate that the mock has only been invoked once
          expect(fetchMock.calls(mockOptions.name).length).toEqual(1);
          return keystone.serviceEndpoint();
        })
        .then(() => {
          expect(fetchMock.calls(mockOptions.name).length).toEqual(1);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });
});
