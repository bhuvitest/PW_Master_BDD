import { PlaywrightWrapper } from '../utils/wrapper';

export class AccountPage {
  constructor(private readonly wrapper: PlaywrightWrapper) {
  }

  async openAccounts(): Promise<void> { await this.wrapper.clickByText('Accounts'); }
  async openCreateAccount(): Promise<void> { await this.wrapper.clickByText('Create Account'); }
  async enterAccountName(value: string): Promise<void> { await this.wrapper.fill('#accountName', `${value}_${Math.floor(1000 + Math.random() * 9000)}`); }
  async enterDescription(value: string): Promise<void> { await this.wrapper.fill('textarea[name="description"]', value); }
  async enterEmployeeCount(value: string): Promise<void> { await this.wrapper.fill('#numberEmployees', value); }
  async enterSiteName(value: string): Promise<void> { await this.wrapper.fill('#officeSiteName', value); }
  async create(): Promise<void> { await this.wrapper.click('input.smallSubmit'); }
  async title(): Promise<string> { return this.wrapper.getTitle(); }
}