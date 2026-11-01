import { PlaywrightWrapper } from '../utils/wrapper';

export class LoginPage {
  constructor(private readonly wrapper: PlaywrightWrapper) {
  }

  async open(url: string): Promise<void> { await this.wrapper.navigateTo(url); }
  async enterUsername(username: string): Promise<void> { await this.wrapper.fill('#username', username); }
  async enterPassword(password: string): Promise<void> { await this.wrapper.fill('#password', password); }
  async clickLogin(): Promise<void> { await this.wrapper.click('input.decorativeSubmit'); }
  async clickCrmSfa(): Promise<void> { await this.wrapper.clickByText('CRM/SFA'); }
}