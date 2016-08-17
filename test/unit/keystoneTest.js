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
    const authUrl = mockData.config.auth.auth_url;

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
});
