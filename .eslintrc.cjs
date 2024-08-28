module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:vitest/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "@typescript-eslint"],
  rules: {
    "react-refresh/only-export-components": "warn"
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parserOptions: {
        project: [
          "./app/tsconfig.json",
          "./authenticate/tsconfig.json",
          "./options/tsconfig.json",
          "./shared/tsconfig.json"
        ],
      },
    },
  ],
};
