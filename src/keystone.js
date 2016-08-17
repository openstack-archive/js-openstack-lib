import Http from './util/http';

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
