import { info } from '../libs/logs.js';

test('info', () => {
  expect(console.log(info('abc'))).toBe(1);
});
