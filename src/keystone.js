import Http from './util/http';

/**
 * A list of all supported versions. Please keep this array sorted by most recent.
 *
 * @type {Array} An array of version instances.
 */
const supportedKeystoneVersions = [
  'v3.7'
];

export default class Keystone {

  constructor (cloudConfig) {
    // Sanity checks.
    if (!cloudConfig) {
      throw new Error('A configuration is required.');
    }
    // Clone the config, so that this instance is immutable
    // at runtime (no modifying the config after the fact).
    this.cloudConfig = Object.assign({}, cloudConfig);
    this.http = new Http();
  }

  /**
   * Retrieve all the API versions available.
   *
   * @returns {Promise.<T>} A promise that will resolve with the list of API versions.
   */
  versions () {
    return this.http
      .httpGet(this.cloudConfig.auth.auth_url)
      .then((response) => response.json())
      .then((body) => {
        return body.versions.values;
      });
  }

  /**
   * Retrieve the API version declaration that is currently in use by this keystone
   * instance.
   *
   * @returns {Promise.<T>} A promise that will resolve with the specific API version.
   */
  version () {
    return this
      .versions()
      .then((versions) => {
        for (let version of versions) {
          if (supportedKeystoneVersions.indexOf(version.id) > -1) {
            return version;
          }
        }
        throw new Error("No supported Keystone API version available.");
      });
  }

  authenticate() {
    const body = {
      auth: {
        identity: {
          methods: ['password'],
          password: {
            user: {
              name: this.cloudConfig.auth.username,
              password: this.cloudConfig.auth.password
            }
          }
        }
      }
    };

    return this.http.httpPost(this.cloudConfig.auth.auth_url, body)
      .then((res) => {
        this.token = res.headers.get('X-Subject-Token');
        return res.json(); // This returns a promise...
      })
      .then((body) => {
        this.catalog = body.catalog || {};
      })
      .catch((reason) => {
        return reason;
      });
  }
}
