import 'isomorphic-fetch';
import log from 'loglevel';

log.setLevel('INFO');

export default class Keystone {

  constructor(cloudsConfig, cloudName) {
    if (cloudsConfig.clouds.hasOwnProperty(cloudName)) {
      this.cloudConfig = cloudsConfig.clouds[cloudName];
    } else {
      throw new Error('Config for this cloud not found');
    }

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
