const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const javaHomeCandidates = [
  process.env.ALLURE_JAVA_HOME,
  process.env.JAVA_HOME,
  'C:\\Program Files\\Java\\jdk-21'
].filter(Boolean);
const javaHome = javaHomeCandidates.find(candidate =>
  fs.existsSync(path.join(candidate, 'bin', 'java.exe')) ||
  fs.existsSync(path.join(candidate, 'bin', 'java'))
);

if (!javaHome) {
  console.error('Java was not found. Set ALLURE_JAVA_HOME or JAVA_HOME to a JDK installation.');
  process.exit(1);
}

process.env.JAVA_HOME = javaHome;
process.env.PATH = `${path.join(javaHome, 'bin')}${path.delimiter}${process.env.PATH || ''}`;

const allureCli = require.resolve('allure-commandline/bin/allure');
const result = spawnSync(process.execPath, [allureCli, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
