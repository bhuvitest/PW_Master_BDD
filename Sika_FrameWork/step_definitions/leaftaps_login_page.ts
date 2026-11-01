import { Given, When } from "@cucumber/cucumber";
import { CustomWorld } from "../hooks/custom-world";

const applicationOf = (world: CustomWorld) => {
  if (!world.application) {
    throw new Error("Leaftaps application facade is not initialized");
  }
  return world.application;
};

Given("Load the Leaftaps login page", async function (this: CustomWorld) {
  await applicationOf(this).login.openLoginPage();
});

When("Enter the username as {string}", async function (this: CustomWorld, username: string) {
  await applicationOf(this).login.enterUsername(username, this.testData);
});

When("Enter the password as {string}", async function (this: CustomWorld, password: string) {
  await applicationOf(this).login.enterPassword(password, this.testData);
});

When("Click on the Login button", async function (this: CustomWorld) {
  await applicationOf(this).login.submit();
});

When("Click on CRMSFA link", async function (this: CustomWorld) {
  await applicationOf(this).login.openCrm();
});
