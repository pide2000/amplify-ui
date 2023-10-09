module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(ts|tsx)',

    // do not collect coverage from:
    // - constants files
    '!<rootDir>/src/**/*(c|C)onstants.ts',
    // - __mock__ directories
    '!<rootDir>/src/**/__mock__/*',
    // do not collect from export files
    '!<rootDir>/**/index.(ts|tsx)',
  ],
  coverageThreshold: {
    global: {
      branches: 89,
      functions: 87,
      lines: 90,
      statements: 90,
    },
  },
  globals: { 'ts-jest': { tsconfig: 'tsconfig.json' } },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  // transformIgnorePatterns: []
  // moduleNameMapper: { '^react$': '<rootDir>/node_modules/react' },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
};
