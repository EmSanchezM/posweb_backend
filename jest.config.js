/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  // chai >= 5 ships ESM only, so it must be transpiled to CommonJS for Jest.
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": ["ts-jest", { tsconfig: { allowJs: true } }],
  },
  transformIgnorePatterns: ["/node_modules/(?!(\\.pnpm/)?chai[@/])"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
