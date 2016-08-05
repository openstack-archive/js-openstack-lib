/*eslint no-process-env: "off" */
import fs from 'fs';
import karma from 'karma/lib/config';
import path from 'path';

function getDevstackConfig() {
  const karmaConfig = karma.parseConfig(path.resolve('./karma.conf.js'));
  return "[[post-config|$KEYSTONE_CONF]]\n" +
    "[cors]\n" +
    "allowed_origin=http://localhost:" + karmaConfig.port + "\n";
}

fs.appendFile(process.env.BASE + '/new/devstack/local.conf', getDevstackConfig(), (err) => {
  if (err) {
    throw err;
  }
});
