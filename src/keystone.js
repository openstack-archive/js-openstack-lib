import AbstractService from './util/abstractService';

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
  constructor(cloudConfig) {
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
  _safeConfigGet(path) {
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
  versions() {
    return super.versions()
      .then((versions) => versions.values);
  }

  /**
   * Issue a token from the provided credentials. Credentials will be read from the
   * configuration, unless they have been explicitly provided.
   *
   * NOTE: This method is only applicable if the password auth plugin on keystone is enabled.
   * Other auth methods will have to be provided by third-party developers.
   *
   * @param {Object} credentials Optional credentials.
   * @param {String} credentials.user_id An optional user ID.
   * @param {String} credentials.username An optional user name.
   * @param {String} credentials.password An optional password.
   * @param {String} credentials.user_domain_id An optional user domain ID.
   *   Not required if a user ID is given.
   * @param {String} credentials.user_domain_name An optional user domain name.
   *   Not required if a user ID is given.
   * @param {String} credentials.project_id An optional project ID.
   * @param {String} credentials.project_name An optional project name.
   * @param {String} credentials.project_domain_id An optional project domain ID.
   *   Not required if a project ID is given.
   * @param {String} credentials.project_domain_name An optional project domain name.
   *   Not required if a project ID is given.
   * @returns {Promise.<T>} A promise which will resolve with a valid token.
   */
  tokenIssue({
    user_id: userId = this._safeConfigGet('auth.user_id'),
    username = this._safeConfigGet('auth.username'),
    password = this._safeConfigGet('auth.password'),
    user_domain_id: userDomainId = this._safeConfigGet('auth.user_domain_id'),
    user_domain_name: userDomainName = this._safeConfigGet('auth.user_domain_name'),
    project_id: projectId = this._safeConfigGet('auth.project_id'),
    project_name: projectName = this._safeConfigGet('auth.project_name'),
    project_domain_id: projectDomainId = this._safeConfigGet('auth.project_domain_id'),
    project_domain_name: projectDomainName = this._safeConfigGet('auth.project_domain_name')
  } = {}) {
    let project;
    let user = {password};

    if (userId) {
      user.id = userId;
    } else if (username) {
      user.name = username;
      if (userDomainId) {
        user.domain = {id: userDomainId};
      } else if (userDomainName) {
        user.domain = {name: userDomainName};
      } else {
        user.domain = {id: 'default'};
      }
    }

    if (projectId) {
      project = {id: projectId};
    } else if (projectName) {
      project = {name: projectName};
      if (projectDomainId) {
        project.domain = {id: projectDomainId};
      } else if (projectDomainName) {
        project.domain = {name: projectDomainName};
      } else {
        project.domain = {id: 'default'};
      }
    }

    const body = {
      auth: {
        identity: {
          methods: ['password'],
          password: {user}
        },
        scope: project ? {project} : 'unscoped'
      }
    };

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
  tokenRevoke(token, adminToken = null) {
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
   * Get information about a token.
   *
   * @param {String} token The authorization token.
   * @returns {Promise.<T>} A promise which will resolve with information about the token.
   */
  tokenInfo(token) {
    return Promise
      .all([this.serviceEndpoint(), token])
      .then(([url, token]) => {
        return [url, {
          'X-Subject-Token': token,
          'X-Auth-Token': token
        }];
      })
      .then(([url, headers]) => this.http.httpRequest('GET', `${url}auth/tokens`, headers))
      .then((response) => response.json());
  }

  /**
   * List the service catalog for the configured cloud.
   *
   * @param {String} token The authorization token.
   * @returns {Promise.<T>} A promise which will resolve with the service catalog.
   */
  catalogList(token = null) {
    return this
      ._requestComponents(token)
      .then(([url, headers]) => this.http.httpRequest('GET', `${url}auth/catalog`, headers))
      .then((response) => response.json())
      .then((body) => body.catalog);
  }
}
