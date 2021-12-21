import fs from 'fs';
import yaml from 'js-yaml';
import NodeCache from 'node-cache';
import { merge } from 'lodash-es';
import { APP_ROOT } from './global.js';

const root = (dir) => `${APP_ROOT}/${dir}`.replace(/(\/+)/g, '/');

const cache = global._msCache || new NodeCache();
if (!global._msCache) {
  global._msCache = cache;
}

const server_conf_key = 'ms-server-conf-key';

/**
 * Load yaml file.
 * @param filePath
 * @return {*} json formatted content
 */
const loadYaml = (filePath) => {
  try {
    return yaml.load(fs.readFileSync(filePath), 'utf8');
  } catch (e) {
    return false;
  }
};

const getConfig = (key = '') => {
  let config = cache.get(server_conf_key);
  if (!config) {
    // parse config yaml
    config = loadYaml(root('server/config.yaml')) || {};
    const tryFile = root('server/local_config.yaml');
    if (fs.existsSync(tryFile)) {
      // merge local_config
      const local_config = loadYaml(tryFile);
      if (typeof local_config === 'object') {
        merge(config, local_config);
      }
    }

    cache.set(server_conf_key, config);
  }
  return key ? config[key] : config;
};

const getServerConfig = () => getConfig('server');

export {
  root,
  loadYaml,
  getConfig,
  getServerConfig
};
