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

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file and configure as needed:

```bash
cp .env.example .env
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
├── .github/workflows
│   └── playwright.yml              # CI workflow for Playwright tests
├── config
│   └── config.ts                   # URL, browser, timeout, artifact, and data settings
├── features
│   ├── createAccount.feature       # Account scenarios
│   └── createLead.feature          # Lead scenarios
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
│   └── leaftaps_login_page.ts         # Login step definitions
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

- Base URL
- Headless mode
- Video recording
- Trace recording
- Log level

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Interview Preparation

### Question 2: Explain the Framework

This is a hybrid automation framework built with Playwright, TypeScript,
Cucumber BDD, Page Object Model, external test data, Winston logging, and two
reporting pipelines.

- **Cucumber.js** runs Gherkin feature files and maps `Given`, `When`, and
  `Then` steps to TypeScript step definitions. Browser profiles are provided
  for Chrome, Microsoft Edge, Firefox, and WebKit.
- **Playwright** manages browser, context, page, locator, navigation, and test
  artifact APIs.
- **TypeScript** provides strict typing for the framework and its Cucumber
  World.
- **Hooks and Custom World** manage scenario lifecycle. The registered
  `CustomWorld` class stores the browser, context, page, scenario metadata,
  one `PlaywrightWrapper`, and the page objects for that scenario.
- **Page Object Model** keeps private page-specific locators and business
  actions in `pages/login.page.ts`, `pages/account.page.ts`, and
  `pages/leads.page.ts`. Step definitions contain only Gherkin mapping and
  business-level calls.
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

The framework is designed to be extended for CI/CD. The current GitHub
workflow executes the Playwright example test; Cucumber can be added to that
workflow with the same npm scripts used locally.

### Question 3: Explain the Execution Flow

```text
Cucumber profile
  -> ts-node/register
  -> hooks and step definitions loaded
  -> CustomWorld registered for each scenario
  -> BeforeAll creates artifact directories
  -> Before reads scenario metadata and selects the browser
  -> Browser -> BrowserContext -> Page
  -> PlaywrightWrapper and page objects are created once per scenario
  -> Feature steps call typed step definitions
  -> Step definitions call page-object business methods
  -> Page objects use private locators and Playwright APIs
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
- **Encapsulation:** Page objects hide private locators and expose business
  actions such as `enterUsername()` and `clickLogin()`. The Custom World also
  owns scenario state.
- **Polymorphism:** There is no deliberate method overloading or overriding in
  the current implementation. Browser selection is handled through the
  configured browser implementation and profile.

The practical design is:

```text
Feature -> typed Step Definition -> Page Object -> Playwright
                                  \-> Wrapper for reusable framework operations
```

### Question 5: Installation and Execution Commands

Install the existing dependencies and browsers:

```bash
npm install
npx playwright install
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