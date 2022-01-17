const fs = require('fs');
const yaml = require('js-yaml');
const NodeCache = require('node-cache');
const get = require('lodash/get');
const merge = require('lodash/merge');
const isEmpty = require('lodash/isEmpty');
const pick = require('lodash/pick');

const APP_ROOT = process.cwd();
const root = (dir) => `${APP_ROOT}/${dir}`.replace(/(\/+)/g, '/');

const cache = global._msCache || new NodeCache();
if (!global._msCache) {
  global._msCache = cache;
}

const server_conf_key = 'ms-server-conf-key';
const MANIFEST_CACHE_KEY_PREFIX = 'MANIFEST_CACHE_KEY_';
const LOCALE_MANIFEST_CACHE_KEY = 'LOCALE_MANIFEST_CACHE_KEY';

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

const getCache = () => cache;

const isValidReferer = (path) =>
  !isEmpty(path) && path !== '/' && path.indexOf('/login') === -1;

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

const getClientConfig = () => getConfig('client') || {};

const getTitle = () => {
  const { title } = getClientConfig();
  if (title && typeof title === 'string') {
    return title;
  }
  return '';
};

const getServerConfig = () => getConfig('server') || {};

const getHttp = () => {
  const { http } = getServerConfig();
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
  const { static: httpStatic } = getHttp();
  if (httpStatic && typeof httpStatic === 'object') {
    return httpStatic;
  }
  return {};
};

const HOSTNAME = getHostname();
const PORT = getPort();
const HTTP_MODE = 'http';

const safeParseJSON = (json, defaultValue) => {
  let result;
  try {
    result = JSON.parse(json);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  if (!result && defaultValue !== undefined) {
    return defaultValue;
  }
  return result;
};

const getManifest = (entry) => {
  let manifestCache = cache.get(`${MANIFEST_CACHE_KEY_PREFIX}${entry}`);

  if (!manifestCache) {
    let data = {};
    try {
      const dataStream = fs.readFileSync(root('dist/manifest.json'));
      data = safeParseJSON(dataStream.toString(), {});
      // eslint-disable-next-line no-empty
    } catch (err) {}
    manifestCache = get(data, `entrypoints.${entry}`);
    cache.set(`${MANIFEST_CACHE_KEY_PREFIX}${entry}`, manifestCache);
  }

  return manifestCache;
};

const getLocaleManifest = () => {
  let manifestCache = cache.get(LOCALE_MANIFEST_CACHE_KEY);

  if (!manifestCache) {
    let data = {};
    try {
      const dataStream = fs.readFileSync(root('dist/manifest.locale.json'));
      data = safeParseJSON(dataStream.toString(), {});
      // eslint-disable-next-line no-empty
    } catch (error) {}
    const isLocale = (key) => key.startsWith('locale-');
    manifestCache = pick(data, Object.keys(data).filter(isLocale));
    cache.set(LOCALE_MANIFEST_CACHE_KEY, manifestCache);
  }

  return manifestCache;
};

module.exports = {
  root,
  loadYaml,
  getCache,
  getConfig,
  getClientConfig,
  getTitle,
  getServerConfig,
  getHttp,
  getHttpStatic,
  getManifest,
  getLocaleManifest,
  isValidReferer,
  safeParseJSON,
  APP_ROOT,
  HOSTNAME,
  PORT,
  HTTP_MODE,
};
