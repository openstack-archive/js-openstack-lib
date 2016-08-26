/*eslint no-process-env: "off" */
import fs from 'fs';
import karma from 'karma/lib/config';
import path from 'path';

function getDevstackConfig() {
  const karmaConfig = karma.parseConfig(path.resolve('./karma.conf.js'));

  return getCorsConfig('$KEYSTONE_CONF', karmaConfig) +
    getCorsConfig('$GLANCE_API_CONF', karmaConfig);

}

function getCorsConfig(service, karmaConfig) {
  return `[[post-config|${service}]]
[cors]
allowed_origin=http://localhost:${karmaConfig.port}
`;
}

fs.appendFile(process.env.BASE + '/new/devstack/local.conf', getDevstackConfig(), (err) => {
  if (err) {
    throw err;
  }
});
