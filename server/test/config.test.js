import { getServerConfig } from '../libs/utils';

test('http.port is 8000', () => {
  const serverConfig = getServerConfig();
  expect(serverConfig.http.port).toBe(8000);
});
