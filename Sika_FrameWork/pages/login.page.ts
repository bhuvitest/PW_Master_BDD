import { PlaywrightWrapper } from '../utils/wrapper';

export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  private readonly crmSfaLink;

  constructor(private readonly wrapper: PlaywrightWrapper) {
    const page = wrapper.page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('input.decorativeSubmit');
    this.crmSfaLink = page.getByRole('link', { name: 'CRM/SFA' });
  }

  async open(url: string): Promise<void> { await this.wrapper.navigateTo(url); }
  async enterUsername(username: string): Promise<void> { await this.usernameInput.fill(username); }
  async enterPassword(password: string): Promise<void> { await this.passwordInput.fill(password); }
  async clickLogin(): Promise<void> { await this.loginButton.click(); }
  async clickCrmSfa(): Promise<void> { await this.crmSfaLink.click(); }
}