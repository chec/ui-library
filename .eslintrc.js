module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    '@chec/eslint-config/vue',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // Change line length from 100 -> 120 to have consistency with PHP
    'max-len': ['error', 120],
    'arrow-parens': 'off',
    'import/extensions': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
