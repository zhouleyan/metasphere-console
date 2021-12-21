const fs = require('fs');
const yaml = require('js-yaml');
const NodeCache = require('node-cache');
const merge = require('lodash/merge');
const path = require('path');

const APP_ROOT = path.resolve(__dirname, '../../');
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

const getServerConfig = () => getConfig('server') || {};

const getHttp = () => {
  const serverConfig = getServerConfig();
  const { http } = serverConfig;
  if (http && typeof http === 'object') {
    return http;
  }
  return {};
};

const getHostname = () => {
  const defaultHostname = 'localhost';
  const { hostname } = getHttp();
  if (hostname && typeof hostname === 'string') {
    return hostname;
  }
  return defaultHostname;
};

const getPort = () => {
  const defaultPort = '8000';
  const { port } = getHttp();
  if (port && typeof port === 'number') {
    return port;
  }
  return defaultPort;
};

const getHttpStatic = () => {
  const { 'static': httpStatic } = getHttp();
  if (httpStatic && typeof httpStatic === 'object') {
    return httpStatic;
  }
  return {};
};

const HOSTNAME = getHostname();
const PORT = getPort();
const HTTP_MODE = 'http';

module.exports = {
  root,
  loadYaml,
  getConfig,
  getServerConfig,
  getHttp,
  getHttpStatic,
  APP_ROOT,
  HOSTNAME,
  PORT,
  HTTP_MODE
};
