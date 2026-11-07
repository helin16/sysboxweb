// Unit tests: Jest + React Testing Library, compiled with Next's own SWC setup.
// End-to-end tests live in tests/e2e and run with Playwright (see playwright.config.ts).
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/tests/unit/**/*.test.{ts,tsx}"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  coverageReporters: ["text", "text-summary", "html", "lcov"],
  // Fail the run if coverage drops, so gaps are noticed in review.
  coverageThreshold: {
    global: { statements: 98, branches: 95, functions: 98, lines: 98 },
  },
};

module.exports = createJestConfig(config);
