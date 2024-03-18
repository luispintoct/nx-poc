module.exports = {
  // Specifies the test runner and TypeScript configuration.
  // Sets up TypeScript support for Jest.
  preset: "ts-jest",

  // Specifies the test environment.
  // For Node.js testing, we use 'node'.
  testEnvironment: "node",

  // Specifies the pattern for test files.
  // Assumes test files have either a .spec.ts or .test.ts extension and are located in the src directory.
  testMatch: ["<rootDir>/tests/**/*.spec.ts", "<rootDir>/tests/**/*.test.ts"],

  // Specifies the file extensions Jest should look for when resolving modules.
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Specifies the files to collect coverage information from.
  // Collects coverage from TypeScript files within the src directory.
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],

  // Specifies the directory where coverage reports will be generated.
  coverageDirectory: "coverage",

  // Allows configuring globals for Jest.
  // Specifies the ts-jest configuration to use the tsconfig.json file from the root directory.
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },

  // Specifies the minimum coverage threshold for the project.
  coverageThreshold: {
    // Sets the minimum coverage threshold for all files to 90%.
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
