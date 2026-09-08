import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { CustomWorld } from '../hooks/custom-world';

const accountPage = (world: CustomWorld) => {
  if (!world.accountPage) throw new Error('Account page is not initialized');
  return world.accountPage;
};

When('Click on the Accounts tab', async function (this: CustomWorld): Promise<void> {
  await accountPage(this).openAccounts();
});

When('Click on the Create Account button', async function (this: CustomWorld): Promise<void> {
  await accountPage(this).openCreateAccount();
});

When('Enter account name as {string}', async function (this: CustomWorld, accountName: string): Promise<void> {
  await accountPage(this).enterAccountName(accountName);
});

When('Enter description as {string}', async function (this: CustomWorld, description: string): Promise<void> {
  await accountPage(this).enterDescription(description);
});

When('Enter number of employees as {string}', async function (this: CustomWorld, employeeCount: string): Promise<void> {
  await accountPage(this).enterEmployeeCount(employeeCount);
});

When('Enter site name as {string}', async function (this: CustomWorld, siteName: string): Promise<void> {
  await accountPage(this).enterSiteName(siteName);
});

When('Click on Create Account button', async function (this: CustomWorld): Promise<void> {
  await accountPage(this).create();
});

Then('Verify that the title contains {string} after account is created', async function (this: CustomWorld, expectedTitle: string): Promise<void> {
  assert.ok((await accountPage(this).title()).includes(expectedTitle));
});