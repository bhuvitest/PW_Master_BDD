import { Page, BrowserContext } from '@playwright/test';
import { DEFAULT_TIMEOUT} from '../config/config';
import { createLogger } from './logger';
const logger = createLogger('wrapper');

/**
 * Wrapper class for Playwright Page interactions
 */
export class PlaywrightWrapper {

  private page: Page;
  private readonly context: BrowserContext

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }


  /**
   * Navigate to a URL
   * @param url - The URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'load', timeout: DEFAULT_TIMEOUT });
  }

  /**
   * Get page title
   * @returns The page title
   */
  async getTitle(): Promise<string> {
    await this.page.waitForLoadState("networkidle")
    const title = await this.page.title();
    logger.info(`Page title: ${title}`);
    return title;
  }

  /**
   * Get the current URL
   * @returns The current URL
   */
  async getCurrentUrl(): Promise<string> {
    const url = this.page.url();
    logger.info(`Current URL: ${url}`);
    return url;
  }

  /**
   * Click on an element
   * @param selector - The element selector
   */
  async click(selector: string): Promise<void> {
    logger.info(`Clicking on: ${selector}`);
    await this.page.click(selector, { timeout: DEFAULT_TIMEOUT });
  }

  /**
   * Click an element by exact visible text.
   */
  async clickByText(text: string, exact = true): Promise<void> {
    logger.info(`Clicking text: ${text}`);
    await this.page.getByText(text, { exact }).click({ timeout: DEFAULT_TIMEOUT });
  }

  /**
   * Open a popup after clicking the lookup icon and return the popup page.
   */
  async openPopup(selector: string, index = 0): Promise<Page> {
    logger.info(`Opening popup at ${selector}[${index}]`);
    const popupPromise = this.page.waitForEvent('popup');
    await this.page.locator(selector).nth(index).click({ timeout: DEFAULT_TIMEOUT });
    return await popupPromise;
  }

  async clickFirstVisibleLink(selectors: string | string[]): Promise<{ href: string | null; text: string }> {
    const selectorList = Array.isArray(selectors) ? selectors : [selectors];

    for (const selector of selectorList) {
      const links = this.page.locator(selector);
      const count = await links.count();

      for (let index = 0; index < count; index++) {
        const link = links.nth(index);
        if (await link.isVisible()) {
          const href = await link.getAttribute("href");
          const text = (await link.innerText()).trim();
          await link.click({ timeout: DEFAULT_TIMEOUT });
          return { href, text };
        }
      }
    }

    throw new Error(`No visible link found for selectors "${selectorList.join('", "')}"`);
  }

  async fillOnPage(targetPage: Page, selector: string, value: string): Promise<void> {
    logger.info(`Filling ${selector} on popup page`);
    const field = targetPage.locator(selector);
    await field.clear({ timeout: DEFAULT_TIMEOUT });
    await field.fill(value, { timeout: DEFAULT_TIMEOUT });
  }

  async clickOnPage(targetPage: Page, selector: string): Promise<void> {
    logger.info(`Clicking ${selector} on popup page`);
    await targetPage.locator(selector).click({ timeout: DEFAULT_TIMEOUT });
  }

  async waitForVisibleOnPage(targetPage: Page, selector: string): Promise<void> {
    logger.info(`Waiting for ${selector} on popup page`);
    await targetPage.locator(selector).first().waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT });
  }

  async clickVisibleLinkByText(
    targetPage: Page,
    selector: string,
    text: string,
    expectedHref?: string
  ): Promise<{ href: string | null; text: string }> {
    const matches = targetPage.locator(selector).filter({ hasText: text });
    await matches.first().waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT });

    const count = await matches.count();
    if (count !== 1) {
      throw new Error(`Expected one visible link containing "${text}", found ${count}`);
    }

    const link = matches.first();
    const href = await link.getAttribute('href');
    const linkText = (await link.innerText()).trim();
    if (expectedHref && !href?.includes(expectedHref)) {
      throw new Error(`Expected link href to contain "${expectedHref}", found "${href ?? "none"}"`);
    }

    await link.click({ timeout: DEFAULT_TIMEOUT });

    return { href, text: linkText };
  }

  async clickAndAcceptDialog(selector: string): Promise<string> {
    const dialogPromise = this.page.waitForEvent('dialog').then(async (dialog) => {
      const message = dialog.message();
      await dialog.accept();
      return message;
    });

    await this.page.locator(selector).click({ timeout: DEFAULT_TIMEOUT });
    const message = await dialogPromise;
    await this.page.waitForLoadState('domcontentloaded', { timeout: DEFAULT_TIMEOUT });
    logger.info(`Accepted browser dialog: ${message}`);
    return message;
  }

  /**
   * Accept the next browser dialog.
   */
  async acceptDialog(): Promise<void> {
    const dialog = await this.page.waitForEvent('dialog');
    await dialog.accept();
  }

  /**
   * Double click on an element
   * @param selector - The element selector
   */
  async doubleClick(selector: string): Promise<void> {
    logger.info(`Double clicking on: ${selector}`);
    await this.page.dblclick(selector, { timeout: DEFAULT_TIMEOUT });
  }

  /**
   * Fill an input element
   * @param selector - The input element selector
   * @param value - The value to fill
   */
  async fill(selector: string, value: string): Promise<void> {
    logger.info(`Filling ${selector} with value: ${value}`);
    await this.page.locator(selector).clear();
    await this.page.fill(selector, value, { timeout: DEFAULT_TIMEOUT });
  }

  /**
   * Check if an element is visible
   * @param selector - The element selector
   * @returns True if the element is visible, false otherwise
   */
  async isVisible(selector: string): Promise<boolean> {
    logger.info(`Checking if ${selector} is visible`);
    const element = this.page.locator(selector);
    return await element.isVisible({ timeout: DEFAULT_TIMEOUT });
  }

  /**
   * Wait for an element to be visible
   * @param selector - The element selector
   * @param timeout - The timeout in milliseconds (optional)
   */
  async waitForVisible(selector: string, timeout = DEFAULT_TIMEOUT): Promise<void> {
    logger.info(`Waiting for ${selector} to be visible`);
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   * @param selector - The element selector
   * @param timeout - The timeout in milliseconds (optional)
   */
  async waitForHidden(selector: string, timeout = DEFAULT_TIMEOUT): Promise<void> {
    logger.info(`Waiting for ${selector} to be hidden`);
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  async waitForTextPattern(selector: string, pattern: string, timeout = DEFAULT_TIMEOUT): Promise<void> {
    logger.info(`Waiting for ${selector} to match ${pattern}`);
    await this.page.waitForFunction(
      ({ targetSelector, textPattern }) => {
        const element = document.querySelector(targetSelector);
        const text = element?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        return new RegExp(textPattern, 'i').test(text);
      },
      { targetSelector: selector, textPattern: pattern },
      { timeout }
    );
  }

  /**
   * Get text from an element
   * @param selector - The element selector
   * @returns The element text
   */
  async getText(selector: string): Promise<string> {
    logger.info(`Getting text from: ${selector}`);
    const text = await this.page.locator(selector).innerText({ timeout: DEFAULT_TIMEOUT });
    logger.info(`Text content: ${text}`);
    return text;
  }

  /**
   * Get all text values from elements matching a selector
   * @param selector - The element selector
   * @returns Array of text values
   */
  async getAllTexts(selector: string): Promise<string[]> {
    logger.info(`Getting all texts from: ${selector}`);
    const elements = this.page.locator(selector);
    const count = await elements.count();
    const texts: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await elements.nth(i).innerText();
      texts.push(text);
    }

    logger.info(`Found ${texts.length} texts`);
    return texts;
  }

  /**
   * Select an option from a dropdown by value
   * @param selector - The dropdown selector
   * @param value - The value to select
   */
  async selectByValue(selector: string, value: string): Promise<void> {
    logger.info(`Selecting value ${value} from dropdown ${selector}`);
    await this.page.selectOption(selector, { value });
  }

  /**
   * Select an option from a dropdown by label
   * @param selector - The dropdown selector
   * @param label - The label to select
   */
  async selectByLabel(selector: string, label: string): Promise<void> {
    logger.info(`Selecting label ${label} from dropdown ${selector}`);
    await this.page.selectOption(selector, { label });
  }

  /**
   * Switch to a tab by index
   * @param index - The tab index
   */
  async switchToTab(index: number): Promise<void> {
    logger.info(`Switching to tab index: ${index}`);
    const pages = this.context.pages();

    if (index >= pages.length) {
      throw new Error(`Tab index out of bounds: ${index}, total tabs: ${pages.length}`);
    }

    this.page = pages[index];
    await this.page.bringToFront();
  }

  /**
   * Take a screenshot
   * @param path - The file path to save the screenshot
   */
  async takeScreenshot(path: string): Promise<void> {
    logger.info(`Taking screenshot: ${path}`);
    await this.page.screenshot({ path, fullPage: true });
  }

  /**
   * Execute JavaScript in the page context
   * @param script - The JavaScript code to execute
   * @param args - Arguments to pass to the script
   * @returns The result of script execution
   */
  async executeScript<T>(script: string, ...args: any[]): Promise<T> {
    logger.info('Executing JavaScript');
    return await this.page.evaluate(script, ...args);
  }

  /**
   * Refresh the current page
   */
  async refresh(): Promise<void> {
    logger.info('Refreshing page');
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    logger.info('Going back in browser history');
    await this.page.goBack({ waitUntil: 'networkidle' });
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    logger.info('Going forward in browser history');
    await this.page.goForward({ waitUntil: 'networkidle' });
  }

  async keyBoardpress(selector: string, key: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible' });
    await this.page.locator(selector).focus()
    await this.page.keyboard.press(key);
  }

}