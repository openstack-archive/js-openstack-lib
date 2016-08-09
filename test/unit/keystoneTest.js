import Keystone from '../../src/keystone.js';
import fetchMock from 'fetch-mock';

describe('Openstack connection test', () => {
  it('should export a class', () => {
    const keystone = new Keystone(aCloudsConfig('cloud1'), 'cloud1');
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
    const cloudsConfig = aCloudsConfig('cloud1');

    const authUrl = cloudsConfig.clouds.cloud1.auth.auth_url;

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

    const keystone = new Keystone(cloudsConfig.clouds.cloud1);

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

  function aCloudsConfig (name) {
    const cloudsConfig = {
      clouds: {}
    };

    cloudsConfig.clouds[name] = {
      region_name: 'Region1',
      auth: {
        username: 'user',
        password: 'pass',
        project_name: 'js-openstack-lib',
        auth_url: 'http://keystone'
      }
    };

    return cloudsConfig;
  }
});
