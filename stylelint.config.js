module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    'no-empty-source': null,
    'rule-empty-line-before': null,
    'no-missing-end-of-source-newline': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'extends',
          'variants',
          'responsive',
          'screen',
          'import'
        ]
      }
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    indentation: [2],
    'block-no-empty': null,
    'unit-allowed-list': ['em', 'rem', 's', 'px', 'vh', 'vw', '%', 'deg', 'ms']
  },
  theme: {
    fontFamily: {
     'sans': ['Poppins', 'system-ui', ...],
     'serif': ['ui-serif', 'Georgia', ...],
     'mono': ['ui-monospace', 'SFMono-Regular', ...],
     'display': ['Oswald'],
     'body': ['Poppins'],
    }
  }
};