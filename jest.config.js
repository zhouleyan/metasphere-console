const path = require('path');

module.exports = {
  // The glob patterns Jest uses to detect test files
  // see issue https://github.com/facebook/jest/issues/7108
  testMatch: [
    path.join(__dirname, '(src|server)/**/*.test.[tj]s?(x)')
  ],
  transform: {
    '\\.[jt]sx?$': 'babel-jest'
  }
};
