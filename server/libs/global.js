import path from 'path';
import { getServerConfig } from './config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getHostname = () => {
  const serverConfig = getServerConfig();
  const defaultHostname = 'localhost';
  const { http } = serverConfig;
  if (http && typeof http === 'object') {
    const { hostname } = http;
    if (hostname && typeof hostname === 'string') {
      return hostname;
    }
  }
  return defaultHostname;
};

const getPort = () => {
  const serverConfig = getServerConfig();
  const defaultPort = 'localhost';
  const { http } = serverConfig;
  if (http && typeof http === 'object') {
    const { port } = http;
    if (port && typeof port === 'number') {
      return port;
    }
  }
  return defaultPort;
};

const APP_ROOT = path.resolve(__dirname, '../../');
const HOSTNAME = getHostname();
const PORT = getPort();
const HTTP_MODE = 'http';

export {
  APP_ROOT,
  HOSTNAME,
  PORT,
  HTTP_MODE,
  __filename,
  __dirname
};
