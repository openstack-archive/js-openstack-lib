/*eslint no-process-env: "off", no-sync: "off"*/
import fs from 'fs';
import path from 'path';

const resolvePaths = [
  './clouds.yaml',
  process.env.HOME + '/.config/openstack/clouds.yaml',
  '/etc/openstack/clouds.yaml'
];

function fileExists(path) {
  try {
    fs.statSync(path);
    return true;
  } catch(err) {
    return false;
  }
}

const cloudFiles = resolvePaths.filter(fileExists);

export default cloudFiles.length > 0 ? path.resolve(cloudFiles[0]) : 'clouds.yaml';

