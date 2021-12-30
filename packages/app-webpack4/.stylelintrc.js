module.exports = {
  extends: 'stylelint-config-sass-guidelines',
  rules: {
    'at-rule-name-case': 'lower',
    'block-no-empty': true,
    'no-empty-source': null,
    'declaration-block-semicolon-newline-after': null,
    'no-duplicate-selectors': null,
    'scss/selector-no-redundant-nesting-selector': null,
    'rule-empty-line-before': null,
    'max-nesting-depth': null,
    'order/properties-alphabetical-order': null,
    'declaration-colon-newline-after': 'always-multi-line',
    'value-list-comma-newline-after': 'always-multi-line',
  },
};
