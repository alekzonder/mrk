// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pathsToModuleNameMapper } = require("ts-jest/dist/config");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { compilerOptions } = require("./tsconfig.json");

module.exports = require("@0devs/package/config/jest.config");

// module.exports.runner = 'jest-runner-tsc';

module.exports.roots = ["<rootDir>/src"];

module.exports.automock = false;

module.exports.collectCoverage = true;

module.exports.collectCoverageFrom = [
  "src/*/**",
  "!**/src/migration/**",
  "!**/src/spec/**",
  "!**/__snapshots__/**",
  "!**/*.spec.ts",
  "!**/__mocks__/**",
  "!**/__spec__/**",
];

module.exports.moduleFileExtensions = ["ts", "tsx", "js"];

module.exports.globals = {
  "ts-jest": {
    tsconfig: "tsconfig.json",
    diagnostics: false,
  },
};

module.exports.testMatch = ["**/src/**/*.spec.ts"];

module.exports.transform = {
  // '^.+\\.(ts|tsx)$': 'ts-jest',
  "^.+\\.(t|j)sx?$": "@swc/jest",
};

module.exports.moduleNameMapper = pathsToModuleNameMapper(
  compilerOptions.paths,
  { prefix: "<rootDir>/" }
);

module.exports.coverageThreshold = {
  global: {
    "branches": 80,
    "functions": 80,
    "lines": 80,
    "statements": 80
  }
};