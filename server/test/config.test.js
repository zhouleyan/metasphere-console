import { getServerConfig } from '../libs/config';

test('http.port is 8000', () => {
  const serverConfig = getServerConfig();
  expect(serverConfig.http.port).toBe(8000);
});
