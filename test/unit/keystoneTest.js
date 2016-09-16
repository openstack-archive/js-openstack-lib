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
      keystone.tokenIssue();
    } catch (e) {
      expect(e.message).toEqual('A configuration is required.');
    }
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

  describe("tokenIssue()", () => {

    it("should 'just work' by using provided credentials from the config.", (done) => {
      fetchMock.mock(mockData.root());
      fetchMock.mock(mockData.tokenIssue());
      const keystone = new Keystone(mockData.config);
      keystone
        .tokenIssue()
        .then((token) => {
          expect(token).toEqual('test_token'); // From mock data
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should not cache its results", (done) => {
      let mockOptions = mockData.tokenIssue();
      fetchMock.mock(mockData.root());
      fetchMock.mock(mockOptions);

      const keystone = new Keystone(mockData.config);
      keystone
        .tokenIssue()
        .then((token) => {
          expect(token).toEqual('test_token'); // From mock data
          expect(fetchMock.calls(mockOptions.name).length).toEqual(1);
          return keystone.tokenIssue();
        })
        .then((token) => {
          expect(token).toEqual('test_token'); // From mock data
          expect(fetchMock.calls(mockOptions.name).length).toEqual(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("tokenRevoke()", () => {
    let keystone = null;

    beforeEach(() => {
      fetchMock.mock(mockData.root());
      keystone = new Keystone(mockData.config);
    });

    it("should return a 204 response on a valid revocation.", (done) => {
      const token = 'test_token';
      const adminToken = 'test_admin_token';

      fetchMock.mock(mockData.tokenRevoke(token, adminToken));
      keystone
        .tokenRevoke(token, adminToken)
        .then((response) => {
          expect(response.status).toEqual(204); // From mock data
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should not cache its results", (done) => {
      const token = 'test_token';

      let mockOptions = mockData.tokenRevoke(token);
      fetchMock.mock(mockOptions);

      keystone
        .tokenRevoke(token)
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(fetchMock.calls(mockOptions.name).length).toEqual(1);

          // Yes, I realize that this should actually return an error since the token is no
          // longer valid, but we're testing for promise caching here, not valid http flow.
          return keystone.tokenRevoke(token);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(fetchMock.calls(mockOptions.name).length).toEqual(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("catalogList()", () => {
    let keystone = null;

    beforeEach(() => {
      fetchMock.mock(mockData.root());
      keystone = new Keystone(mockData.config);
    });

    it("should return the catalog as an array.", (done) => {
      const token = 'test_token';

      fetchMock.mock(mockData.catalogList(token));
      keystone
        .catalogList(token)
        .then((catalog) => {
          expect(catalog.length).not.toBe(0);
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should not cache its results", (done) => {
      const token = 'test_token';

      let mockOptions = mockData.catalogList(token);
      fetchMock.mock(mockOptions);

      keystone
        .catalogList(token)
        .then(() => {
          expect(fetchMock.calls(mockOptions.name).length).toEqual(1);
          return keystone.catalogList(token);
        })
        .then(() => {
          expect(fetchMock.calls(mockOptions.name).length).toEqual(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });
});
