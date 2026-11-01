# Playwright Cucumber TypeScript Framework

A comprehensive test automation framework built with Playwright, Cucumber, and TypeScript that includes reporting, data handling, and utility wrappers.

## Features

- TypeScript integration
- Cucumber BDD implementation
- Multiple browser support (Chrome, Firefox, WebKit)
- HTML, JSON, and Allure reporting
- Video recording of test execution
- Screenshots on failure
- Trace recording for debugging
- CSV, JSON, and Excel data handling
- Wrapper methods for common interactions
- Tab handling utilities

## Application Facade

Step definitions delegate application operations to
`facades/leaftaps-application-facade.ts`. The facade groups login, lead,
merge-lead, and account workflows and uses `PlaywrightWrapper` for browser
interactions. Hooks retain ownership of browser, context, page, trace, video,
and scenario cleanup. The page classes remain available, but new step
definitions should use the application facade rather than Playwright directly.

## Prerequisites

- Node.js 20, 22, or 24+
- npm

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm ci
```

3. Copy the example environment file and configure as needed.

```bash
cp .env.example .env
```

In PowerShell:

```powershell
Copy-Item .env.example .env
```

Install the Chrome browser used by the default execution profile:

```bash
npx playwright install chrome
```

## Running Tests

Run all tests with Chrome (default):

```bash
npm test
```

Run with specific browser:

```bash
npm run test:chrome  or npx cucumber-js -p chrome
npm run test:firefox or npx cucumber-js -p firefox
npm run test:webkit  or npx cucumber-js -p webkit
```
run parallel execution

```bash
npx cucumber-js --parallel 4
```

run using tag Name:

```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js -p chrome --tags "@CreateLead"
```



## Generating Reports

Generate HTML reports:

```bash
npm run report:generate
```

Generate Allure reports:

```bash
npm run allure:generate
npm run allure:open
```

Allure requires Java. On Windows, configure the installed JDK 21 once in
PowerShell, then open a new terminal:

```powershell
[Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-21', 'User')
[Environment]::SetEnvironmentVariable('Path', "$([Environment]::GetEnvironmentVariable('Path', 'User'));%JAVA_HOME%\bin", 'User')
```

Verify the setup with `java -version` before running the Allure commands.

## Project Structure

```
├── ../Jenkinsfile                  # Nightly CI pipeline for the master branch
├── .github/workflows
│   └── playwright.yml              # CI workflow for Playwright tests
├── config
│   └── config.ts                   # URL, browser, timeout, artifact, and data settings
├── features
│   ├── createAccount.feature       # Account scenarios
│   ├── createLead.feature          # Lead scenarios
│   ├── data-driven-lead.feature    # JSON-driven lead scenarios
│   ├── lead-management.feature     # Lead lifecycle scenarios
│   └── merge-lead.feature          # Merge lead scenario
├── facades
│   └── leaftaps-application-facade.ts # Application workflows
├── hooks
│   ├── custom-world.ts             # Typed Cucumber World with Playwright context
│   └── hooks.ts                    # Browser lifecycle and test artifact hooks
├── pages
│   ├── account.page.ts              # Account page locators and actions
│   ├── leads.page.ts                # Leads page locators and actions
│   └── login.page.ts                # Login page locators and actions
├── reports                             # Generated Cucumber and execution artifacts
│   ├── allure-results
│   ├── screenshots
│   ├── traces
│   ├── videos
│   ├── cucumber-report.html
│   ├── cucumber-report.json
│   └── cucumber-html-report-<timestamp>
├── allure-report                         # Generated Allure report site
├── step_definitions
│   ├── leaftaps_Account_page.ts       # Account step definitions
│   ├── leaftaps_Leads_page.ts         # Lead step definitions
│   ├── leaftaps_Merge_Leads_page.ts   # Merge lead step definitions
│   ├── leaftaps_login_page.ts         # Login step definitions
│   └── data_parameterization_steps.ts # JSON data loading steps
├── test-data
│   ├── test.csv                       # CSV test data
│   └── users.json                     # JSON test data
├── tests
│   └── example.spec.ts                # Playwright test example
├── utils
│   ├── allure-cli.js                  # Allure command wrapper
│   ├── allure-reporter.js             # Cucumber Allure integration
│   ├── data-reader.ts                 # CSV, JSON, and Excel data readers
│   ├── fakerUtils.ts                  # Generated test data helpers
│   ├── logger.ts                      # Winston logging utilities
│   ├── report-generator.js            # HTML report generation
│   └── wrapper.ts                     # Playwright interaction helpers
├── cucumber.js                         # Cucumber profiles and formatters
├── package.json                        # Scripts and dependencies
├── tsconfig.json                       # TypeScript compiler settings
├── .env                                # Local environment configuration (ignored)
├── .env.example                        # Safe environment configuration template
└── .gitignore                          # Ignored local and generated files
```

## Writing Tests

### Feature Files

Create feature files in the `features` directory:

```gherkin
Feature: Example feature

  Scenario: Example scenario
    Given I navigate to the application
    When I perform an action
    Then I should see expected results
```

### Step Definitions

Create step definition files in the `step_definitions` directory:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';

Given('I navigate to the application', async function() {
  // Implementation
});
```

## Configuration

Edit the `.env` file to configure:

- `BASE_URL`: application login URL
- `BROWSER`: `chrome`, `msedge`, `firefox`, or `webkit`
- `HEADLESS`: `true` or `false`
- `VIDEO_ENABLED` and `TRACE_ENABLED`: `true` or `false`
- `SCREENSHOT_EACH_STEP`: capture screenshots for passed steps; failures are
  screenshotted regardless
- `TAG`: optional Cucumber tag expression; unset runs all scenarios
- `LOG_LEVEL`: Winston logging level

## Advanced Usage

### Data-Driven Testing

Use external data files for data-driven testing:

```gherkin
Scenario: Login with credentials from data file
  Given I have user credentials from "users.json"
  When I login with the first user
  Then I should be successfully logged in
```

### Custom Wrapper Methods

The `PlaywrightWrapper` class provides helper methods for common actions:

```typescript
const wrapper = new PlaywrightWrapper(page);
await wrapper.navigateTo(url);
await wrapper.fill('#username', 'testuser');
await wrapper.click('#login-button');
```

## Jenkins Nightly Pipeline

The new `master` branch contains the enhanced framework and its nightly CI
pipeline. The repository-root `Jenkinsfile` runs the framework from
`Sika_FrameWork/`.
Create a Jenkins Pipeline job configured as **Pipeline script from SCM**, point
it at this repository, and set the branch specifier to `*/master`. The pipeline
uses `checkout scm`, so the Jenkins job's SCM URL and Jenkins-managed checkout
credentials are authoritative; no repository URL or credential ID is embedded
in the Jenkinsfile. The checked-out branch is validated as `master`.

The pipeline verifies Node.js/npm, runs `npm ci`, installs the Playwright
`chrome` browser (and Linux dependencies when running on Linux), runs
`npx tsc --noEmit`, and executes `npm test`. It sets `BROWSER=chrome`,
`HEADLESS=true`, `VIDEO_ENABLED=true`, `TRACE_ENABLED=true`, and
`SCREENSHOT_EACH_STEP=false` for CI to keep reports bounded while retaining
failure screenshots. Provide `BASE_URL` through the Jenkins job/folder
environment if the default URL in `config/config.ts` is not the intended test
environment. Leave `TAG` unset to run all scenarios; set it in Jenkins only
when an intentional scenario filter is needed.

The reporting stage runs the configured Cucumber HTML report generator and
Allure report generator. Provide JDK 21 or later on the agent and configure
`JAVA_HOME` or `ALLURE_JAVA_HOME` so Allure can create its HTML report.
Artifacts are archived from `Sika_FrameWork/reports/`,
`Sika_FrameWork/allure-report/`, and `Sika_FrameWork/logs/`, including results
from failed tests. Jenkins clears stale report directories before execution;
the test and reporting stages continue after a test failure while keeping the
build status failed. The framework does not emit JUnit XML, so no JUnit
publisher is configured.

The pipeline schedules a nightly build with `H 2 * * *`, using the Jenkins
controller's configured timezone. `disableConcurrentBuilds()` prevents
overlapping executions, and the pipeline remains manually buildable. Ensure
the Jenkins agent has Node.js/npm on `PATH`; on Linux, the agent must also allow
Playwright to install the required system browser dependencies. There is no
lint or format script configured in `package.json`.

Configure Jenkins notifications separately if required; no notification
plugin, recipient, or endpoint is configured in this repository. The test
features currently use the public Leaftaps demo account fixture. Do not use
those fixtures against a protected environment; move credentials to Jenkins
Credentials and update the test-data integration before targeting one.

For failures, inspect the Jenkins console log and archived artifacts under
`Sika_FrameWork/reports/`, `Sika_FrameWork/allure-report/`, and
`Sika_FrameWork/logs/`. A failed compile or test step fails the build; the
`post` section still archives available diagnostics.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Interview Preparation

### Question 2: Explain the Framework

This is a hybrid automation framework built with Playwright, TypeScript,
Cucumber BDD, an application facade, external test data, Winston logging, and
two reporting pipelines.

- **Cucumber.js** runs Gherkin feature files and maps `Given`, `When`, and
  `Then` steps to TypeScript step definitions. Browser profiles are provided
  for Chrome, Microsoft Edge, Firefox, and WebKit.
- **Playwright** manages browser, context, page, locator, navigation, and test
  artifact APIs.
- **TypeScript** provides strict typing for the framework and its Cucumber
  World.
- **Hooks and Custom World** manage scenario lifecycle. The registered
  `CustomWorld` stores browser state, scenario metadata, test data, and the
  scenario's `LeaftapsApplicationFacade`.
- **Application Facade** groups application workflows under login, leads,
  merge leads, and accounts. Step definitions call these business-level APIs;
  the facade delegates browser operations to `PlaywrightWrapper`.
- **Page classes** remain in `pages/` for compatibility, but facade-backed
  step definitions do not call Playwright or page objects directly.
- **PlaywrightWrapper** centralizes reusable framework operations such as
  navigation, waits, text retrieval, dropdowns, tab handling, screenshots,
  keyboard actions, and configured timeouts.
- **Configuration** loads `BASE_URL`, `BROWSER`, `HEADLESS`, video, trace, and
  log settings from `.env` through `config.ts`.
- **Test data** is separated by responsibility: `data-reader.ts` reads CSV,
  JSON, and Excel files, while `fakerUtils.ts` generates dynamic data.
- **Winston** writes module-based logs to the console and `logs/test.log`.
- **Reporting** uses `multiple-cucumber-html-reporter` for the Cucumber JSON
  report and `allure-cucumberjs` plus the Allure CLI for Allure results and the
  interactive report.

The framework includes a Jenkins nightly pipeline at the repository root.
The existing GitHub Actions workflow remains configured separately.

### Question 3: Explain the Execution Flow

```text
Cucumber profile
  -> ts-node/register
  -> hooks and step definitions loaded
  -> CustomWorld registered for each scenario
  -> BeforeAll creates artifact directories
  -> Before reads scenario metadata and selects the browser
  -> Browser -> BrowserContext -> Page
  -> PlaywrightWrapper and LeaftapsApplicationFacade are created per scenario
  -> Feature steps call typed step definitions
  -> Step definitions call application-facade operations
  -> Facade operations use PlaywrightWrapper and Playwright APIs
  -> After captures configured screenshots, stops tracing, attaches artifacts
  -> Browser closes and duration is logged
  -> AfterAll performs final cleanup
```

During execution, Cucumber writes `reports/cucumber-report.json` and
`reports/cucumber-report.html`. The custom Allure formatter registered in
`cucumber.js` writes result files to `reports/allure-results`. The two report
outputs are generated independently:

```text
Cucumber JSON -> multiple-cucumber-html-reporter -> reports/cucumber-html-report-<timestamp>
Allure formatter -> reports/allure-results -> allure generate -> allure-report
```

Screenshots are controlled independently for failed and passed scenarios by
`takeOnFailure` and `takeOnSuccess`. Video and trace recording are controlled
by `VIDEO_ENABLED` and `TRACE_ENABLED`.

### Question 4: Explain the OOP Structure

- **Inheritance:** `CustomWorld` extends Cucumber's `World`. `AllureReporter`
  extends `CucumberJSAllureFormatter`.
- **Abstraction:** `PlaywrightWrapper` exposes reusable framework operations
  without requiring step definitions to manage common Playwright options.
- **Encapsulation:** The facade exposes application actions such as login,
  lead creation, and account creation while `PlaywrightWrapper` keeps its
  Playwright page private. The Custom World owns scenario state.
- **Polymorphism:** There is no deliberate method overloading or overriding in
  the current implementation. Browser selection is handled through the
  configured browser implementation and profile.

The practical design is:

```text
Feature -> typed Step Definition -> Application Facade -> Wrapper -> Playwright
```

### Question 5: Installation and Execution Commands

Install the existing dependencies and Chrome browser:

```bash
npm ci
npx playwright install chrome
```

Run the framework with a browser profile:

```bash
npm test
npm run test:chrome
npm run test:msedge
npm run test:firefox
npm run test:webkit
```

Run a tagged feature or parallel execution:

```bash
npx cucumber-js --profile chrome --tags "@CreateLead"
npx cucumber-js --parallel 4
```

Generate the reports:

```bash
npm run report:generate
npm run allure:generate
npm run allure:open
```

Before execution, copy `.env.example` to `.env` and configure the environment
values. `.env` is ignored by Git and must not contain credentials committed to
the repository.