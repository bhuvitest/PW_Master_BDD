import { Given, When } from '@cucumber/cucumber';
import { BASE_URL } from '../config/config';
import { CustomWorld } from '../hooks/custom-world';

const loginPage = (world: CustomWorld) => {
     if (!world.loginPage) throw new Error('Login page is not initialized');
     return world.loginPage;
};

Given('Load the Leaftaps login page', async function (this: CustomWorld): Promise<void> {
     await loginPage(this).open(BASE_URL);
});

When('Enter the username as {string}', async function (this: CustomWorld, username: string): Promise<void> {
     await loginPage(this).enterUsername(username);
});

When('Enter the password as {string}', async function (this: CustomWorld, password: string): Promise<void> {
     await loginPage(this).enterPassword(password);
});

When('Click on the Login button', async function (this: CustomWorld): Promise<void> {
     await loginPage(this).clickLogin();
});

When('Click on CRMSFA link', async function (this: CustomWorld): Promise<void> {
     await loginPage(this).clickCrmSfa();
});