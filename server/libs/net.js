import os from 'os';

export const interfaces = os.networkInterfaces();

export const getNetworkAddress = () => {
  for (const name of Object.keys(interfaces)) {
    for (const _interface of interfaces[name]) {
      const { address, family, internal } = _interface;
      if (family === 'IPv4' && !internal) {
        return address;
      }
    }
  }
};
