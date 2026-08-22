const { AllureRuntime, CucumberJSAllureFormatter } = require('allure-cucumberjs');
const path = require('path');

module.exports = class AllureReporter extends CucumberJSAllureFormatter {
  constructor(options) {
    super(options, new AllureRuntime({
      resultsDir: path.resolve(__dirname, '../reports/allure-results')
    }), {
      labels: [],
      links: []
    });
  }
};
