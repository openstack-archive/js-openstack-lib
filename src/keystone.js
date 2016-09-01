import AbstractService from './util/abstract_service';

/**
 * A list of all supported versions. Please keep this array sorted by most recent.
 *
 * @type {Array}
 * @ignore
 */
const supportedKeystoneVersions = [
  'v3.7'
];

export default class Keystone extends AbstractService {

  /**
   * This class provides direct, idempotent, low-level access to the Keystone API of a specific
   * cloud. The constructor requires that you provide a configuration object for a specific
   * cloud, formatted as per the os-client-config specification of clouds.yaml. An important
   * difference is that it does not accept the entire clouds.yaml structure, only the subsection
   * that refers to a specific cloud.
   *
   * @param {{}} cloudConfig The configuration object for a specific cloud.
   * @see http://docs.openstack.org/developer/os-client-config/#site-specific-file-locations
   */
  constructor (cloudConfig) {
    // Sanity checks.
    if (!cloudConfig) {
      throw new Error('A configuration is required.');
    }
    // Clone the config, so that this instance is immutable
    // at runtime (no modifying the config after the fact).
    cloudConfig = Object.assign({}, cloudConfig);

    super(cloudConfig.auth.auth_url, supportedKeystoneVersions);
    this.cloudConfig = cloudConfig;
  }

  /**
   * This method provides a safe method for reading values deep inside of an object structure,
   * without encountering TypeErrors.
   *
   * @param {string} path A string representing the dot notation of a config path to read.
   * @private
   * @returns {String} The value found in the config, or null.
   * @ignore
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
   * This method builds common components of a keystone request. It converts any passed token
   * into a promise, resolves the base URL, and then passes the results as an .all() promise,
   * which may be destructured in a followup request.
   *
   * @param {Promise|String} token A promise, or string, representing a token.
   * @returns {Promise} A promise which resolves with [url, token].
   * @private
   */
  _requestComponents (token = null) {
    // Make sure the token is a promise.
    let headerPromise = Promise
      .resolve(token)
      .then((token) => {
        if (token) {
          return {
            'X-Auth-Token': token
          };
        }
        return {};
      });
    return Promise.all([this.serviceEndpoint(), headerPromise]);
  }

  /**
   * Retrieve all the API versions available.
   *
   * @returns {Promise.<T>} A promise that will resolve with the list of API versions.
   */
  versions () {
    return super.versions()
      .then((versions) => versions.values);
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

  /**
   * Revoke an authorization token.
   *
   * @param {String} token The token to revoke.
   * @param {String} adminToken An optional admin token.
   * @returns {Promise.<T>} A promise which will resolve if the token has been successfully revoked.
   */
  tokenRevoke (token, adminToken = null) {
    return Promise
      .all([this.serviceEndpoint(), token, adminToken])
      .then(([url, token, adminToken]) => {
        return [url, {
          'X-Subject-Token': token,
          'X-Auth-Token': adminToken || token
        }];
      })
      .then(([url, headers]) => this.http.httpRequest('DELETE', `${url}auth/tokens`, headers));
  }

  /**
   * List the service catalog for the configured cloud.
   *
   * @param {String} token The authorization token.
   * @returns {Promise.<T>} A promise which will resolve with the service catalog.
   */
  catalogList (token = null) {
    return this
      ._requestComponents(token)
      .then(([url, headers]) => this.http.httpRequest('GET', `${url}auth/catalog`, headers))
      .then((response) => response.json())
      .then((body) => body.catalog);
  }
}
