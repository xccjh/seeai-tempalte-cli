module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': ['off'], // 放开any
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 强制把变量的使用限制在其定义的作用域范围内
    '@typescript-eslint/no-unused-vars': 'off', // 未使用变量
    '@typescript-eslint/no-var-requires': 'off', // 允许require
    '@typescript-eslint/no-empty-function': 'off' // 允许空函数
  }
}
