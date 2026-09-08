import { PlaywrightWrapper } from '../utils/wrapper';

export class LeadsPage {
  private readonly leadsTab;
  private readonly createLeadLink;
  private readonly companyNameInput;
  private readonly firstNameInput;
  private readonly lastNameInput;
  private readonly titleInput;
  private readonly createLeadButton;

  constructor(private readonly wrapper: PlaywrightWrapper) {
    const page = wrapper.page;
    this.leadsTab = page.getByRole('link', { name: 'Leads', exact: true });
    this.createLeadLink = page.getByRole('link', { name: 'Create Lead', exact: true });
    this.companyNameInput = page.locator('#createLeadForm_companyName');
    this.firstNameInput = page.locator('#createLeadForm_firstName');
    this.lastNameInput = page.locator('#createLeadForm_lastName');
    this.titleInput = page.locator('#createLeadForm_generalProfTitle');
    this.createLeadButton = page.locator('input[name="submitButton"]');
  }

  async openLeads(): Promise<void> { await this.leadsTab.click(); }
  async openCreateLead(): Promise<void> { await this.createLeadLink.click(); }
  async enterCompanyName(value: string): Promise<void> { await this.companyNameInput.fill(value); }
  async enterFirstName(value: string): Promise<void> { await this.firstNameInput.fill(value); }
  async enterLastName(value: string): Promise<void> { await this.lastNameInput.fill(value); }
  async enterTitle(value: string): Promise<void> { await this.titleInput.fill(value); }
  async create(): Promise<void> { await this.createLeadButton.click(); }
  async title(): Promise<string> { return this.wrapper.getTitle(); }
}