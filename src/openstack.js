import Keystone from "./keystone";
import Neutron from "./neutron";
import Glance from "./glance";
import Nova from "./nova";

export default class OpenStack {
  /**
   * Create wrapper class that takes clouds.yaml instance
   *
   * @param {{}} cloudConfig The configuration object for a specific cloud.
   */
  constructor(cloudConfig) {
    // Sanity checks.
    if (!cloudConfig) {
      throw new Error('A configuration is required.');
    }
    // Clone the config, so that this instance is immutable
    // at runtime (no modifying the config after the fact).
    cloudConfig = Object.assign({}, cloudConfig);

    this.cloudConfig = cloudConfig;
  }

  getConfig() {
    // Returns the config instance
    return this.cloudConfig;
  }

  /**
   * List the networks available.
   *
   * @returns {Promise.<T>} A promise which will resolve with the list of networks.
   */
  networkList() {
    return this._neutron
      .then((neutron) => neutron.networkList(this._token));
  }

  /**
   * List the images available on glance.
   *
   * @returns {Promise.<T>} A promise which will resolve with the list of images.
   */
  imageList() {
    return this._glance
      .then((glance) => glance.imageList(this._token));
  }

  /**
   * List the flavors available on nova.
   *
   * @returns {Promise.<T>} A promise which will resolve with the list of flavors.
   */
  flavorList() {
    return this._nova
      .then((nova) => nova.flavorList(this._token));
  }

  /**
   * Keystone component.
   *
   * @returns {Promise.<Keystone>} A promise which will resolve with Keystone instance.
   * @private
   */
  get _keystone() {
    if (!this._keystonePromise) {
      this._keystonePromise = Promise.resolve(new Keystone(this.getConfig()));
    }

    return this._keystonePromise;
  }

  /**
   * Neutron component.
   *
   * @returns {Promise.<Neutron>} A promise which will resolve with Neutron instance.
   * @private
   */
  get _neutron() {
    if (!this._neutronPromise) {
      this._neutronPromise = this._getComponentConfigFor('neutron')
        .then((componentConfig) => new Neutron(componentConfig));
    }
    return this._neutronPromise;
  }

  /**
   * Glance component.
   *
   * @returns {Promise.<Glance>} A promise which will resolve with Glance instance.
   * @private
   */
  get _glance() {
    if (!this._glancePromise) {
      this._glancePromise = this._getComponentConfigFor('glance')
        .then((componentConfig) => new Glance(componentConfig));
    }
    return this._glancePromise;
  }

  /**
   * Nova component.
   *
   * @returns {Promise.<Nova>} A promise which will resolve with Nova instance.
   * @private
   */
  get _nova() {
    if (!this._novaPromise) {
      this._novaPromise = this._getComponentConfigFor('nova')
        .then((componentConfig) => new Nova(componentConfig));
    }
    return this._novaPromise;
  }

  /**
   * Token issued from Keystone.
   *
   * @returns {Promise.<T>} A promise which will resolve with the token.
   * @private
   */
  get _token() {
    if (!this._tokenPromise) {
      this._tokenPromise = this._keystone.then((k) => k.tokenIssue());
    }
    return this._tokenPromise;
  }

  /**
   * Return an component config from keystone catalog.
   *
   * @param {String} name A component name to find.
   * @returns {Promise.<{}>} A promise which will resolve with the component config.
   * @private
   */
  _getComponentConfigFor(name) {
    const config = this.getConfig();
    return this._token
      .then((token) => this._keystone.then((keystone) => keystone.catalogList(token)))
      .then((catalog) => catalog.find((entry) => entry.name === name))
      .then((entry) => entry.endpoints.find((endpoint) => {
        return endpoint.region === config.region_name && endpoint.interface === 'public';
      }));
  }

}
