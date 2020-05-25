/* eslint no-sync: "off" */
import yaml from 'js-yaml'
import fs from 'fs'
import cloudsYamlPath from './cloudsYamlPath'

const clouds = yaml.safeLoad(fs.readFileSync(cloudsYamlPath, 'utf8'))

export default clouds
