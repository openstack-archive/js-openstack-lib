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
   * This method provides a safe method for reading values deep inside of an object structure,
   * without encountering TypeErrors.
   *
   * @param {string} path A string representing the dot notation of a config path to read.
   * @private
   * @returns {String} The value found in the config, or null.
   */
  _safeConfigGet (path) {
    let segments = path.split('.');
    let pointer = this.cloudConfig;
    while (segments.length > 0) {
      let prop = segments.shift();
      if (pointer.hasOwnProperty(prop)) {
        pointer = pointer[prop];
      } else {
        return null;
      }
    }
    return pointer;
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

  /**
   * Return the root API endpoint for the current supported keystone version.
   *
   * @returns {Promise.<T>|*} A promise which will resolve with the endpoint URL string.
   */
  serviceEndpoint () {
    if (!this._endpointPromise) {
      this._endpointPromise = this.version()
        .then((version) => {
          if (version.links) {
            for (let i = 0; i < version.links.length; i++) {
              let link = version.links[i];
              if (link.rel === 'self' && link.href) {
                return link.href;
              }
            }
          }
          throw new Error("No service endpoint discovered.");
        });
    }
    return this._endpointPromise;
  }

  /**
   * Issue a token from the provided credentials. Credentials will be read from the
   * configuration, unless they have been explicitly provided. Note that both the userDomainName
   * and the projectDomainName are only required if the user/project names are given, rather
   * than the explicit user/domain ID's.
   *
   * NOTE: This method is only applicable if the password auth plugin on keystone is enabled.
   * Other auth methods will have to be provided by third-party developers.
   *
   * @param {String} username An optional user name or ID.
   * @param {String} password An optional password.
   * @param {String} projectName An optional project name or ID.
   * @param {String} userDomainName Domain name for the user, not required if a user id is given.
   * @param {String} projectDomainName Domain name for the project, not required with project ID.
   * @returns {Promise.<T>} A promise which will resolve with a valid token.
   */
  tokenIssue (username = this._safeConfigGet('auth.username'),
              password = this._safeConfigGet('auth.password'),
              projectName = this._safeConfigGet('auth.project_name'),
              userDomainName = this._safeConfigGet('auth.user_domain_id'),
              projectDomainName = this._safeConfigGet('auth.project_domain_id')) {

    const body = {
      auth: {
        identity: {
          methods: ['password'],
          password: {
            user: {
              name: username,
              password: password
            }
          }
        }
      }
    };

    if (userDomainName) {
      body.auth.identity.password.user.domain = {
        id: userDomainName
      };
    }

    if (!projectName) {
      body.auth.scope = "unscoped";
    } else {
      body.auth.scope = {
        project: {
          name: projectName
        }
      };

      if (projectDomainName) {
        body.auth.scope.project.domain = {
          id: projectDomainName
        };
      }
    }

    return this
      .serviceEndpoint()
      .then((url) => this.http.httpPost(`${url}auth/tokens`, body))
      .then((response) => {
        return response.headers.get('X-Subject-Token');
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

    return this
      .serviceEndpoint()
      .then((url) => this.http.httpPost(url, body))
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
