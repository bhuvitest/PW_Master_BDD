/**
 * This file defines the CustomWorld interface which extends Cucumber's World
 * It provides TypeScript typing for the test automation framework
 */

// Import World from Cucumber for extension
// Import Playwright types for browser automation
import { Browser, BrowserContext, Page } from '@playwright/test';
import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { PlaywrightWrapper } from '../utils/wrapper';
import { AccountPage } from '../pages/account.page';
import { LeadsPage } from '../pages/leads.page';
import { LoginPage } from '../pages/login.page';

/**
 * CustomWorld interface - extends the base Cucumber World
 * Provides type definitions for browser automation properties and test metadata
 * Used as the context for each Cucumber scenario
 */
export interface WorldParameters {
    browser?: string;
}

export class CustomWorld extends World<WorldParameters> {
    /**
     * The Playwright Browser instance
     * Represents the browser being automated (Chrome, Firefox, etc.)
     * Set to null initially and instantiated in Before hook
     */
    browser: Browser | null = null;

    /**
     * The Playwright BrowserContext instance
     * Represents an isolated browser context with its own cache, cookies, etc.
     * Set to null initially and instantiated in Before hook
     */
    context: BrowserContext | null = null;

    /**
     * The Playwright Page instance
     * Represents a single tab or window within the browser
     * Set to null initially and instantiated in Before hook
     */
    page: Page | null = null;

    /**
     * The name of the current test/scenario
     * Used for naming artifacts like screenshots, videos, and traces
     * Formatted version of the Cucumber scenario name (spaces replaced with dashes)
     */
    testName = '';

    /**
     * The timestamp when the test started
     * Used to calculate test duration
     * Set in the Before hook when scenario starts
     */
    startTime = new Date();

    /**
     * Custom parameters passed to the test
     * Can be provided through Cucumber's parameterType or command line
     */
    readonly parameters: WorldParameters;
    wrapper: PlaywrightWrapper | null = null;
    loginPage: LoginPage | null = null;
    accountPage: AccountPage | null = null;
    leadsPage: LeadsPage | null = null;

    constructor(options: IWorldOptions<WorldParameters>) {
        super(options);
        this.parameters = options.parameters;
    }
}

setWorldConstructor(CustomWorld);