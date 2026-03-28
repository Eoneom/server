module.exports = {
  'env': {
    'node': true,
    'es2021': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [ '@typescript-eslint' ],
  'rules': {
    'array-bracket-spacing': [
      'error',
      'always'
    ],
    'array-bracket-newline': [
      'error',
      {
        minItems: 2,
        multiline: true
      }
    ],
    'array-element-newline': [
      'error',
      { minItems: 2 }
    ],
    'object-property-newline': 'error',
    'arrow-spacing': [
      'error',
      {
        'before': true,
        'after': true
      }
    ],
    'block-spacing': 'error',
    'brace-style': [
      'error',
      '1tbs'
    ],
    'comma-dangle': [
      'error',
      'only-multiline'
    ],
    'comma-spacing': [
      'error',
      {
        'before': false,
        'after': true
      }
    ],
    'computed-property-spacing': [
      'error',
      'never'
    ],
    'dot-location': [
      'error',
      'property'
    ],
    'eol-last': [
      'error',
      'always'
    ],
    'func-call-spacing': [
      'error',
      'never'
    ],
    'function-call-argument-newline': [
      'error',
      'consistent'
    ],
    'function-paren-newline': [
      'error',
      'multiline'
    ],
    'implicit-arrow-linebreak': [
      'error',
      'beside'
    ],
    'indent': [
      'error',
      2
    ],
    'keyword-spacing': [
      'error',
      {
        'before': true,
        'after': true
      }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'no-constant-binary-expression': 'error',
    'no-duplicate-imports': 'error',
    'no-multi-spaces': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'error',
    'no-unmodified-loop-condition': 'error',
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'object-curly-newline': [
      'error',
      {
        multiline: true,
        minProperties: 2
      }
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'template-curly-spacing': [
      'error',
      'never'
    ],
  },
}
