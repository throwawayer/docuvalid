require('core-js/stable');
require('regenerator-runtime/runtime');

module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/dist/**', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1,
    },
  },
  setupFiles: ['regenerator-runtime/runtime', 'core-js'],
  testRegex: 'src/.*\\.spec\\.tsx?$',
};
