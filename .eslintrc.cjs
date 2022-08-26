module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "brace-style": [2, "allman"],
    "object-curly-spacing": [2, "always"],
    "indent": [2, "tab"],
    "@typescript-eslint/no-unsafe-assignment": 1,
    "@typescript-eslint/no-unsafe-member-access": 1,
  },
  root: true,
};
