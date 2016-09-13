export {default as Keystone} from './keystone';
export {default as Glance} from './glance';
export {default as Neutron} from './neutron';

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
}
