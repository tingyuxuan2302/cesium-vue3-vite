module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    // 'plugin:prettier/recommended',
    "eslint-config-prettier",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    requireConfigFile: false,
    parser: "@babel/eslint-parser",
  },
  plugins: ["vue", "prettier"],
  rules: {
    "vue/multi-word-component-names": 0,
    "no-unreachable": 2,
    "no-unused-vars": 1,
    "no-const-assign": 2,
    "no-undef": 2,
  },
};
