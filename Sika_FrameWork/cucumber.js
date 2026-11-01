
require('dotenv').config();

const browserName = process.env.BROWSER;
const configuredTag = process.env.TAG?.trim();
const tagExpression = configuredTag && /^[A-Za-z0-9_-]+$/.test(configuredTag)
  ? `@${configuredTag}`
  : configuredTag || '';

const common = {
  tags: tagExpression,
  requireModule: ['ts-node/register'],
  require: [
    'step_definitions/**/*.ts',
    'hooks/**/*.ts'
  ],
  format: [
    'progress',
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html',
    './utils/allure-reporter.js',
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  }
  
};

module.exports = {
  chrome: {
    ...common,
    worldParameters: {
      browser: browserName || 'chrome'
    }
  },
  msedge: {
    ...common,
    worldParameters: {
      browser: browserName || 'msedge'
    }
  },
  firefox: {
    ...common,
    worldParameters: {
      browser: browserName || 'firefox'
    }
  },
  webkit: {
    ...common,
    worldParameters: {
      browser: browserName || 'webkit'
    }
  },
  default: {
    ...common,
    worldParameters: {
      browser: browserName
    }
  }
};
