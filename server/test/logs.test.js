test('root', () => {
  const p = process.cwd();
  console.log(p);
  expect(p).toBe(
    '/Users/zhouleyan/go/src/metasphere.io/metasphere-console/server/test'
  );
});
