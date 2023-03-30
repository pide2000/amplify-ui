module.exports = {
  plugins: ['@typescript-eslint', 'jest'],
  extends: ['plugin:jest/recommended'],
  rules: {
    // turn off for test file linting
    '@typescript-eslint/no-unsafe-assignment': 'off',

    // allow empty fragments for unit tests
    'react/jsx-no-useless-fragment': 'off',

    // jest rules either not in recommended rule set or overridden
    'jest/expect-expect': ['error', { assertFunctionNames: ['expect*'] }],
    'jest/no-mocks-import': 'off',
    'jest/unbound-method': 'error',
  },
};
