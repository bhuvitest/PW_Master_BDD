import { PlaywrightWrapper } from '../utils/wrapper';

export class AccountPage {
  private readonly accountsTab;
  private readonly createAccountLink;
  private readonly accountNameInput;
  private readonly descriptionInput;
  private readonly employeesInput;
  private readonly siteNameInput;
  private readonly createAccountButton;

  constructor(private readonly wrapper: PlaywrightWrapper) {
    const page = wrapper.page;
    this.accountsTab = page.getByRole('link', { name: 'Accounts', exact: true });
    this.createAccountLink = page.getByRole('link', { name: 'Create Account', exact: true });
    this.accountNameInput = page.locator('#accountName');
    this.descriptionInput = page.locator('textarea[name="description"]');
    this.employeesInput = page.locator('#numberEmployees');
    this.siteNameInput = page.locator('#officeSiteName');
    this.createAccountButton = page.locator('input.smallSubmit');
  }

  async openAccounts(): Promise<void> { await this.accountsTab.click(); }
  async openCreateAccount(): Promise<void> { await this.createAccountLink.click(); }
  async enterAccountName(value: string): Promise<void> { await this.accountNameInput.fill(`${value}_${Math.floor(1000 + Math.random() * 9000)}`); }
  async enterDescription(value: string): Promise<void> { await this.descriptionInput.fill(value); }
  async enterEmployeeCount(value: string): Promise<void> { await this.employeesInput.fill(value); }
  async enterSiteName(value: string): Promise<void> { await this.siteNameInput.fill(value); }
  async create(): Promise<void> { await this.createAccountButton.click(); }
  async title(): Promise<string> { return this.wrapper.getTitle(); }
}