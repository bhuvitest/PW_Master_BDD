import { Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../hooks/custom-world";

const accountsOf = (world: CustomWorld) => {
  if (!world.application) {
    throw new Error("Leaftaps application facade is not initialized");
  }
  return world.application.accounts;
};

When("Click on the Accounts tab", async function (this: CustomWorld) {
  await accountsOf(this).openAccounts();
});

When("Click on the Create Account button", async function (this: CustomWorld) {
  await accountsOf(this).openCreateAccount();
});

When("Enter account name as {string}", async function (this: CustomWorld, accountName: string) {
  await accountsOf(this).enterAccountName(accountName);
});

When("Enter description as {string}", async function (this: CustomWorld, description: string) {
  await accountsOf(this).enterDescription(description);
});

When("Enter number of employees as {string}", async function (this: CustomWorld, employeeCount: string) {
  await accountsOf(this).enterEmployeeCount(employeeCount);
});

When("Enter site name as {string}", async function (this: CustomWorld, siteName: string) {
  await accountsOf(this).enterSiteName(siteName);
});

When("Click on Create Account button", async function (this: CustomWorld) {
  await accountsOf(this).submitCreate();
});

Then("Verify that the title contains {string} after account is created", async function (
  this: CustomWorld,
  expectedTitle: string
) {
  await accountsOf(this).verifyPageTitleIncludes(expectedTitle);
});
