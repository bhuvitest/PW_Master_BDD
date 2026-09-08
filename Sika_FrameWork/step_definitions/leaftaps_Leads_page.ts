import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { CustomWorld } from '../hooks/custom-world';

const leadsPage = (world: CustomWorld) => {
  if (!world.leadsPage) throw new Error('Leads page is not initialized');
  return world.leadsPage;
};

When('Click on the Leads tab', async function (this: CustomWorld): Promise<void> {
  await leadsPage(this).openLeads();
});

When('Click on the Create Lead link', async function (this: CustomWorld): Promise<void> {
  await leadsPage(this).openCreateLead();
});

When('Enter company name as {string}', async function (this: CustomWorld, companyName: string): Promise<void> {
  await leadsPage(this).enterCompanyName(companyName);
});

When('Enter first name as {string}', async function (this: CustomWorld, firstName: string): Promise<void> {
  await leadsPage(this).enterFirstName(firstName);
});

When('Enter last name as {string}', async function (this: CustomWorld, lastName: string): Promise<void> {
  await leadsPage(this).enterLastName(lastName);
});

When('Enter title as {string}', async function (this: CustomWorld, title: string): Promise<void> {
  await leadsPage(this).enterTitle(title);
});

When('Click on Create Lead button', async function (this: CustomWorld): Promise<void> {
  await leadsPage(this).create();
});

Then('Verify that the title contains {string} after lead is created', async function (this: CustomWorld, expectedTitle: string): Promise<void> {
  assert.ok((await leadsPage(this).title()).includes(expectedTitle));
});