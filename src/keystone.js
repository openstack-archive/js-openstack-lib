import 'isomorphic-fetch';
import log from 'loglevel';

log.setLevel('INFO');

export default class Keystone {

  constructor(cloudConfig) {
    // Sanity checks.
    if (!cloudConfig) {
      throw new Error('A configuration is required.');
    }
    // Clone the config, so that this instance is immutable
    // at runtime (no modifying the config after the fact).
    this.cloudConfig = Object.assign({}, cloudConfig);
  }

  authenticate() {
    const headers = {
      'Content-Type': 'application/json'
    };
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
    const init = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    };

    return fetch(this.cloudConfig.auth.auth_url, init)
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
