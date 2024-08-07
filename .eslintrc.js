/** @type {import("eslint").Linter.Config} */

module.exports = {
  ignorePatterns: ['apps/**', 'packages/**', 'config/**'],
  extends: ['@starter/eslint-config/library.js'],
  parser: '@typescript-eslint/parser',
  rules: {
    camelcase: 'off',
    'no-useless-constructor': 'off',
  },
}
