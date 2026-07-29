Overview
This repository is a TypeScript + Cucumber (BDD) test automation framework. 
It uses Gherkin feature files under features/. 
TypeScript step definitions under step_definitions/.
helper utilities under utils/. 
Test orchestration, hooks, and world-level state live in hooks/. 
Reports, logs and artifacts are in reports/ and logs/. 
Configuration and credentials are in config/.

Quick install & run (recommended)

Install dependencies from package.json:
If you need to add Cucumber/TS support manually (only if not already in package.json):
Run Cucumber via npx (example; adapt to scripts in package.json or cucumber.js):
Generate HTML report (if utils/report-generator.js supports it):
Folder / file breakdown (what each is for)

cucumber.js — Cucumber CLI configuration (profiles, default require patterns).
package.json — npm scripts and dependency list. Check scripts like "test" or "cucumber" to run the framework.
tsconfig.json — TypeScript compiler options used to compile/execute step defs and helpers.
README.md — project documentation and quick start instructions (if present).

###########
config/

config/config.ts — environment/configuration settings (URLs, timeouts, env-specific values).
/*config/credentialConstants.ts — stored keys or credential constants used by tests.*/
###########
features/

features/createAccount.feature — Gherkin scenarios for account creation.
features/createLead.feature — Gherkin scenarios for lead creation.
###########
hooks/

hooks/custom-world.ts — custom Cucumber World class (shared per-scenario state, helpers).
hooks/hooks.ts — before/after scenario hooks (setup/teardown, screenshot on failure, attach logs).
###########
step_definitions/

step_definitions/leaftaps_login_page.ts — login-related step implementations.
step_definitions/leaftaps_Leads_page.ts — lead-related step implementations.
step_definitions/leaftaps_Account_page.ts — account-related step implementations.
###########
test-data/

test-data/test.csv — CSV test data used by scenarios.
test-data/users.json — JSON user fixtures.
###########
utils/

utils/data-reader.ts — helpers to read CSV/JSON/other test data.
utils/fakerUtils.ts — fake-data generation helpers (names, emails, etc).
utils/logger.ts — logger wrapper for consistent logging.
utils/report-generator.js — post-processing to generate HTML reports from JSON.
utils/wrapper.ts — possible wrapper utilities (browser/session wrappers).
###########
reports/ and artifacts

reports/cucumber-report.json — Cucumber results JSON (used to generate HTML).
reports/cucumber-report.html — generated HTML report.
reports/screenshots/ — screenshots captured on failure.
reports/traces/ and reports/videos/ — optional trace/video artifacts.
logs/ — runtime logs produced during runs.