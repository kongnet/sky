const config = {
  'ver': '0.1.0',
  '.editorconfig': null,
  // '.eslintignore': null,
  '.eslintrc.js': null,
  '.prettierignore': null,
  '.prettierrc': null,
  '.stylelintignore': null,
  '.stylelintrc.json': null,
  'sonar-project.properties': null,
  'packages': {
    'scripts': {
      'lint': 'eslint --ext .js,.vue src && npm run lint:style',
      'lint:fix': "eslint --fix --ext .js,.vue src && stylelint 'src/**/*.css' --fix && stylelint src/**/*.{html,vue} --custom-syntax postcss-html --fix",
      'lint:style': "stylelint 'src/**/*.css' && stylelint src/**/*.{html,vue} --custom-syntax postcss-html",
      'lint-staged': 'lint-staged'
    },
    'lint-staged': {
      'src/**/*.css': 'stylelint --fix',
      'src/**/*.{html,vue}': 'stylelint --custom-syntax postcss-html --fix',
      'src/**/*.{js,vue}': [
        'eslint --ext .js,.vue --fix',
        'git add'
      ]
    },
    'devDependencies': {

      /** eslint */

      'eslint': '^4.19.1',
      'eslint-friendly-formatter': '^3.0.0',
      'eslint-loader': '^1.7.1',
      'eslint-plugin-html': '^6.0.0',
      'eslint-plugin-vue': '^4.7.1',

      /** stylelint */

      'stylelint': '^10.1.0',
      'stylelint-config-prettier': '^5.2.0',
      'stylelint-config-rational-order': '^0.1.2',
      'stylelint-declaration-block-no-ignored-properties': '^2.1.0',
      'stylelint-order': '^3.0.0',

      /** husky */

      'husky': '^2.2.0',
      'lint-staged': '^8.2.1'
    },
    'husky': {
      'hooks': {
        'pre-commit': 'lint-staged'
      }
    }
  }
}
module.exports = config
