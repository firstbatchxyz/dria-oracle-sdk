import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|js)$": "ts-jest",
  },
  // globalSetup: "<rootDir>/environment/setup.ts",
  // globalTeardown: "<rootDir>/environment/teardown.ts",
  testTimeout: 60000,
  verbose: true,
  detectOpenHandles: true,
  maxConcurrency: 1,
  rootDir: "./tests",
  bail: true, // bail out if any test fails
};

export default config;
