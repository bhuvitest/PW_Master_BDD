import { BrowserContext, Page } from "@playwright/test";
import { randomUUID } from "crypto";
import { BASE_URL, DEFAULT_TIMEOUT } from "../config/config";
import { resolveTestDataValue } from "../utils/data-reader";
import { PlaywrightWrapper } from "../utils/wrapper";

type TestDataRecord = Record<string, unknown> | undefined;
type MergeLeadRole = "source" | "target";

const LEAD_RESULT_SELECTORS = [
  "a[href*='set_value']:visible",
  "a[href*='viewLead?partyId=']:visible",
  "div.x-grid3-col-partyId a:visible",
  "div.x-grid3-cell-inner.x-grid3-col-partyId a:visible",
  "div.x-grid3-row-table a:visible"
];

const leadIdFromHref = (href: string | null): string | undefined => {
  if (!href) {
    return undefined;
  }

  return href.match(/set_value\(['"]?(\d+)/i)?.[1]
    ?? href.match(/[?&]partyId=(\d+)/i)?.[1];
};

const assertIncludes = (actual: string, expected: string, subject: string): void => {
  if (!actual.includes(expected)) {
    throw new Error(`Expected ${subject} to include "${expected}", but found "${actual}"`);
  }
};

class LoginFacade {
  constructor(private readonly ui: PlaywrightWrapper) {}

  async openLoginPage(): Promise<void> {
    if (!BASE_URL) {
      throw new Error("BASE_URL must be configured before opening the login page");
    }

    await this.ui.navigateTo(BASE_URL);
  }

  async enterUsername(value: string, data?: TestDataRecord): Promise<void> {
    await this.ui.fill('//input[@id="username"]', resolveTestDataValue(value, data));
  }

  async enterPassword(value: string, data?: TestDataRecord): Promise<void> {
    await this.ui.fill('//input[@id="password"]', resolveTestDataValue(value, data));
  }

  async submit(): Promise<void> {
    await this.ui.click('//input[@class="decorativeSubmit"]');
  }

  async openCrm(): Promise<void> {
    await this.ui.click('//a[contains(text(),"CRM/SFA")]');
  }
}

class LeadsFacade {
  private readonly mergeLeadIds: Partial<Record<MergeLeadRole, string>> = {};
  private mergeRunId?: string;
  private mergePopup?: Page;
  private pendingSearchExpectation?: "empty" | "visible";

  constructor(private readonly ui: PlaywrightWrapper) {}

  async openLeads(): Promise<void> {
    await this.ui.click('//a[text()="Leads"]');
    await this.ui.waitForVisible('//a[text()="Create Lead"]');
  }

  async openCreateLead(): Promise<void> {
    await this.ui.click('//a[text()="Create Lead"]');
    await this.ui.waitForVisible("#createLeadForm_companyName");
  }

  async openFindLeads(): Promise<void> {
    await this.ui.click('//a[text()="Find Leads"]');
    await this.ui.waitForVisible('//button[normalize-space()="Find Leads"]');
  }

  async openMergeLeads(): Promise<void> {
    await this.ui.click('//a[text()="Merge Leads"]');
  }

  async enterCompanyName(value: string, data?: TestDataRecord): Promise<void> {
    await this.ui.fill("#createLeadForm_companyName", resolveTestDataValue(value, data));
  }

  async enterFirstName(value: string, data?: TestDataRecord): Promise<void> {
    await this.ui.fill("#createLeadForm_firstName", resolveTestDataValue(value, data));
  }

  async enterLastName(value: string, data?: TestDataRecord): Promise<void> {
    await this.ui.fill("#createLeadForm_lastName", resolveTestDataValue(value, data));
  }

  async enterTitle(value: string, data?: TestDataRecord): Promise<void> {
    await this.ui.fill("#createLeadForm_generalProfTitle", resolveTestDataValue(value, data));
  }

  async enterPhoneNumber(value: string, data?: TestDataRecord): Promise<void> {
    const phoneNumber = resolveTestDataValue(value, data);
    if (await this.ui.isVisible("#createLeadForm_primaryPhoneNumber")) {
      await this.ui.fill("#createLeadForm_primaryPhoneNumber", phoneNumber);
      return;
    }

    if (await this.ui.isVisible('input[name="phoneNumber"]')) {
      await this.ui.fill('input[name="phoneNumber"]', phoneNumber);
      return;
    }

    throw new Error("Phone number field is not visible on the current page");
  }

  async updateCompanyName(value: string, data?: TestDataRecord): Promise<void> {
    await this.ui.fill("#updateLeadForm_companyName", resolveTestDataValue(value, data));
  }

  async submitCreate(): Promise<void> {
    await this.ui.click('//input[@name="submitButton"]');
  }

  async submitUpdate(): Promise<void> {
    await this.ui.click('//input[@value="Update"]');
  }

  async edit(): Promise<void> {
    await this.ui.click('//a[text()="Edit"]');
  }

  async duplicate(): Promise<void> {
    await this.ui.click('//a[text()="Duplicate Lead"]');
  }

  async delete(): Promise<void> {
    await this.ui.click('//a[text()="Delete"]');
  }

  async selectPhoneSearch(): Promise<void> {
    await this.ui.click('//span[text()="Phone"]');
    await this.ui.waitForVisible('input[name="phoneNumber"]');
  }

  async find(): Promise<void> {
    await this.ui.click('//button[normalize-space()="Find Leads"]');
    if (this.pendingSearchExpectation === "empty") {
      await this.ui.waitForTextPattern(".x-paging-info", "No records to display");
    } else if (this.pendingSearchExpectation === "visible") {
      await this.ui.waitForTextPattern(".x-paging-info", "Displaying records");
    } else {
      await this.ui.waitForTextPattern(".x-paging-info", "No records to display|Displaying records");
    }
    this.pendingSearchExpectation = undefined;
  }

  async selectFirstResult(): Promise<string> {
    const { href, text } = await this.ui.clickFirstVisibleLink(LEAD_RESULT_SELECTORS);
    const leadId = leadIdFromHref(href) ?? text.match(/\b\d+\b/)?.[0];
    if (!leadId) {
      throw new Error(`Could not extract a lead ID from result "${text}"`);
    }
    return leadId;
  }

  async searchById(leadId: string): Promise<void> {
    if (!leadId) {
      throw new Error("A lead ID is required to search");
    }
    await this.ui.fill('input[name="id"]', leadId);
  }

  async verifyCompanyName(expected: string, data?: TestDataRecord): Promise<void> {
    const expectedCompany = resolveTestDataValue(expected, data);
    const actualCompany = await this.ui.getText("#viewLead_companyName_sp");
    assertIncludes(actualCompany, expectedCompany, "lead company name");
  }

  async verifyDuplicateFormDisplayed(): Promise<void> {
    await this.ui.waitForVisible('input[name="submitButton"]');
  }

  async verifyNoRecords(): Promise<void> {
    const summary = await this.ui.getText(".x-paging-info");
    assertIncludes(summary, "No records to display", "lead search summary");
  }

  async verifySingleResult(leadId: string): Promise<void> {
    const summary = (await this.ui.getText(".x-paging-info")).replace(/\s+/g, " ").trim();
    if (!/^Displaying records 1\s*-\s*1 of 1$/i.test(summary)) {
      throw new Error(`Expected one result for lead ${leadId}, found "${summary}"`);
    }
  }

  async verifyPageTitleIncludes(expected: string): Promise<void> {
    const title = await this.ui.getTitle();
    assertIncludes(title, expected, "page title");
  }

  async createUniqueMergeLead(role: MergeLeadRole): Promise<void> {
    this.mergeRunId ??= randomUUID().replace(/-/g, "").slice(0, 12);
    const uniqueId = `${this.mergeRunId}${role}`;
    const companyName = `Merge${uniqueId}`;

    await this.openLeads();
    await this.openCreateLead();
    await this.ui.fill("#createLeadForm_companyName", companyName);
    await this.ui.fill("#createLeadForm_firstName", `Merge${this.mergeRunId}`);
    await this.ui.fill("#createLeadForm_lastName", role);
    await this.ui.fill("#createLeadForm_primaryPhoneNumber", `9${Date.now().toString().slice(-9)}`);
    await this.submitCreate();
    await this.ui.waitForVisible("#viewLead_companyName_sp");
    assertIncludes(await this.ui.getText("#viewLead_companyName_sp"), companyName, "created lead company");

    const leadId = (await this.ui.getCurrentUrl()).match(/[?&]partyId=(\d+)/i)?.[1];
    if (!leadId) {
      throw new Error(`Could not determine the new ${role} lead ID from the current URL`);
    }
    this.mergeLeadIds[role] = leadId;
  }

  async openMergeLookup(index: number): Promise<void> {
    this.mergePopup = await this.ui.openPopup("img[alt='Lookup']", index);
    await this.mergePopup.waitForLoadState("domcontentloaded", { timeout: DEFAULT_TIMEOUT });
  }

  async searchMergeLead(role: MergeLeadRole): Promise<void> {
    const popup = this.getMergePopup();
    const leadId = this.getMergeLeadId(role);
    await this.ui.fillOnPage(popup, 'input[name="id"]', leadId);
    await this.ui.clickOnPage(popup, 'button:has-text("Find Leads")');
    await this.ui.waitForVisibleOnPage(popup, "a[href*='set_value']:visible");
  }

  async selectMergeLead(role: MergeLeadRole): Promise<void> {
    const leadId = this.getMergeLeadId(role);
    const { href } = await this.ui.clickVisibleLinkByText(
      this.getMergePopup(),
      "a[href*='set_value']:visible",
      leadId,
      leadId
    );
    if (leadIdFromHref(href ?? null) !== leadId) {
      throw new Error(`Selected merge lead does not match expected ${role} ID ${leadId}`);
    }
  }

  async mergeSelectedLeads(): Promise<void> {
    const sourceId = this.getMergeLeadId("source");
    const targetId = this.getMergeLeadId("target");
    if (sourceId === targetId) {
      throw new Error("Source and target merge lead IDs must be different");
    }

    const message = await this.ui.clickAndAcceptDialog('//a[normalize-space()="Merge"]');
    if (!message.toLowerCase().includes("sure")) {
      throw new Error(`Unexpected merge confirmation dialog: "${message}"`);
    }
  }

  async searchForMergeLead(role: MergeLeadRole): Promise<void> {
    this.pendingSearchExpectation = role === "source" ? "empty" : "visible";
    await this.searchById(this.getMergeLeadId(role));
  }

  async verifyTargetMergeLeadResult(): Promise<void> {
    const sourceId = this.getMergeLeadId("source");
    const targetId = this.getMergeLeadId("target");

    if (sourceId === targetId) {
      throw new Error("Merge outcome cannot be verified because the lead IDs are identical");
    }

    await this.verifySingleResult(targetId);
  }

  private getMergeLeadId(role: MergeLeadRole): string {
    const leadId = this.mergeLeadIds[role];
    if (!leadId) {
      throw new Error(`The ${role} merge lead has not been created in this scenario`);
    }
    return leadId;
  }

  private getMergePopup(): Page {
    if (!this.mergePopup || this.mergePopup.isClosed()) {
      throw new Error("The merge lead lookup popup is not open");
    }
    return this.mergePopup;
  }
}

class AccountsFacade {
  constructor(private readonly ui: PlaywrightWrapper) {}

  async openAccounts(): Promise<void> {
    await this.ui.click('//a[text()="Accounts"]');
    await this.ui.waitForVisible('//a[text()="Create Account"]');
  }

  async openCreateAccount(): Promise<void> {
    await this.ui.click('//a[text()="Create Account"]');
    await this.ui.waitForVisible("#accountName");
  }

  async enterAccountName(value: string): Promise<void> {
    await this.ui.fill('//input[@id="accountName"]', `${value}_${randomUUID().slice(0, 8)}`);
  }

  async enterDescription(value: string): Promise<void> {
    await this.ui.fill('//textarea[@name="description"]', value);
  }

  async enterEmployeeCount(value: string): Promise<void> {
    await this.ui.fill('//input[@id="numberEmployees"]', value);
  }

  async enterSiteName(value: string): Promise<void> {
    await this.ui.fill('//input[@id="officeSiteName"]', value);
  }

  async submitCreate(): Promise<void> {
    await this.ui.click('//input[@class="smallSubmit"]');
  }

  async verifyPageTitleIncludes(expected: string): Promise<void> {
    const title = await this.ui.getTitle();
    assertIncludes(title, expected, "page title");
  }
}

export class LeaftapsApplicationFacade {
  readonly login: LoginFacade;
  readonly leads: LeadsFacade;
  readonly accounts: AccountsFacade;

  constructor(page: Page, context: BrowserContext) {
    const ui = new PlaywrightWrapper(page, context);
    this.login = new LoginFacade(ui);
    this.leads = new LeadsFacade(ui);
    this.accounts = new AccountsFacade(ui);
  }
}
