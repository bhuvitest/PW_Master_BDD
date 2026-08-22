const reporter = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Generate timestamp
const currentDate = new Date();
const timestamp = currentDate.toISOString().replace(/[:.]/g, '-');
const reportsDir = path.join(__dirname, '../reports');
const browserName = process.env.BROWSER || 'msedge';

// Check if cucumber report exists
const cucumberReportPath = path.join(reportsDir, 'cucumber-report.json');
if (!fs.existsSync(cucumberReportPath)) {
  console.error('Cucumber report not found. Please run tests first.');
  process.exit(1);
}

// Read report data
const reportData = JSON.parse(fs.readFileSync(cucumberReportPath, 'utf8'));
const executionStart = reportData
  .flatMap(feature => feature.elements || [])
  .flatMap(scenario => scenario.steps || [])
  .map(step => step.result?.start)
  .find(Boolean);
const cucumberJsonDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cucumber-report-'));
fs.copyFileSync(cucumberReportPath, path.join(cucumberJsonDir, 'cucumber-report.json'));

// Generate report
reporter.generate({
  jsonDir: cucumberJsonDir,
  reportPath: path.join(reportsDir, `cucumber-html-report-${timestamp}`),
  metadata: {
    browser: {
      name: browserName,
      version: '100'
    },
    device: 'Local test machine',
    platform: {
      name: 'windows',
      version: '10'
    }
  },
  customData: {
    title: 'Test Execution Info',
    data: [
      { label: 'Project', value: 'Playwright Cucumber TypeScript Framework' },
      { label: 'Release', value: '1.0.0' },
      { label: 'Execution Start Time', value: executionStart ? new Date(executionStart).toLocaleString() : 'Unavailable' },
      { label: 'Execution End Time', value: new Date().toLocaleString() }
    ]
  }
});

console.log(`Report generated at: ${path.join(reportsDir, `cucumber-html-report-${timestamp}`)}`);