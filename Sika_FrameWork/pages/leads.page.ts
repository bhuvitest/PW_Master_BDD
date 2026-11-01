import { PlaywrightWrapper } from '../utils/wrapper';

export class LeadsPage {
  constructor(private readonly wrapper: PlaywrightWrapper) {
  }

  async openLeads(): Promise<void> { await this.wrapper.clickByText('Leads'); }
  async openCreateLead(): Promise<void> { await this.wrapper.clickByText('Create Lead'); }
  async enterCompanyName(value: string): Promise<void> { await this.wrapper.fill('#createLeadForm_companyName', value); }
  async enterFirstName(value: string): Promise<void> { await this.wrapper.fill('#createLeadForm_firstName', value); }
  async enterLastName(value: string): Promise<void> { await this.wrapper.fill('#createLeadForm_lastName', value); }
  async enterTitle(value: string): Promise<void> { await this.wrapper.fill('#createLeadForm_generalProfTitle', value); }
  async create(): Promise<void> { await this.wrapper.click('input[name="submitButton"]'); }
  async title(): Promise<string> { return this.wrapper.getTitle(); }
}