export default [
  {
    ignores: ['node_modules'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      semi: ['warn', 'always'],
      indent: ['warn', 2],
      quotes: ['warn', 'single'],
      'no-unused-vars': ['warn'],
    },
  },
];
  