module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/valid-attribute-name': 'off',
    'vue/no-unused-vars': 'off',
    'vue/return-in-computed-property': 'off',
    'no-case-declarations': 'off',
    'no-redeclare': 'off',
    'no-useless-escape': 'off'
  }
}
