import { Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../hooks/custom-world";

const leadsOf = (world: CustomWorld) => {
  if (!world.application) {
    throw new Error("Leaftaps application facade is not initialized");
  }
  return world.application.leads;
};

When("Click on the Leads tab", async function (this: CustomWorld) {
  await leadsOf(this).openLeads();
});

When("Click on the Create Lead link", async function (this: CustomWorld) {
  await leadsOf(this).openCreateLead();
});

When("Click on Find Leads link", async function (this: CustomWorld) {
  await leadsOf(this).openFindLeads();
});

When("Click on Merge Leads link", async function (this: CustomWorld) {
  await leadsOf(this).openMergeLeads();
});

When("Enter company name as {string}", async function (this: CustomWorld, companyName: string) {
  await leadsOf(this).enterCompanyName(companyName, this.testData);
});

When("Enter first name as {string}", async function (this: CustomWorld, firstName: string) {
  await leadsOf(this).enterFirstName(firstName, this.testData);
});

When("Enter last name as {string}", async function (this: CustomWorld, lastName: string) {
  await leadsOf(this).enterLastName(lastName, this.testData);
});

When("Enter title as {string}", async function (this: CustomWorld, title: string) {
  await leadsOf(this).enterTitle(title, this.testData);
});

When("Enter phone number as {string}", async function (this: CustomWorld, phoneNumber: string) {
  await leadsOf(this).enterPhoneNumber(phoneNumber, this.testData);
});

When("Update company name to {string}", async function (this: CustomWorld, companyName: string) {
  await leadsOf(this).updateCompanyName(companyName, this.testData);
});

When("Click on Create Lead button", async function (this: CustomWorld) {
  await leadsOf(this).submitCreate();
});

When("Click on Update button", async function (this: CustomWorld) {
  await leadsOf(this).submitUpdate();
});

When("Click on Edit link", async function (this: CustomWorld) {
  await leadsOf(this).edit();
});

When("Click on Duplicate Lead link", async function (this: CustomWorld) {
  await leadsOf(this).duplicate();
});

When("Click on Delete link", async function (this: CustomWorld) {
  await leadsOf(this).delete();
});

When("Select Phone tab", async function (this: CustomWorld) {
  await leadsOf(this).selectPhoneSearch();
});

When("Click on Find Leads button", async function (this: CustomWorld) {
  await leadsOf(this).find();
});

When("Select the first lead result", async function (this: CustomWorld) {
  this.leadId = await leadsOf(this).selectFirstResult();
});

When("Store lead id", async function (this: CustomWorld) {
  if (!this.leadId) {
    this.leadId = await leadsOf(this).selectFirstResult();
  }
});

When("Search lead by id with stored lead id", async function (this: CustomWorld) {
  if (!this.leadId) {
    throw new Error("No lead ID has been stored in this scenario");
  }
  await leadsOf(this).searchById(this.leadId);
});

Then("Verify lead company name is {string}", async function (this: CustomWorld, expectedCompany: string) {
  await leadsOf(this).verifyCompanyName(expectedCompany, this.testData);
});

Then("Verify duplicate lead creation form is displayed", async function (this: CustomWorld) {
  await leadsOf(this).verifyDuplicateFormDisplayed();
});

Then("Verify no records to display", async function (this: CustomWorld) {
  await leadsOf(this).verifyNoRecords();
});

Then("Verify that the title contains {string} after lead is created", async function (
  this: CustomWorld,
  expectedTitle: string
) {
  await leadsOf(this).verifyPageTitleIncludes(expectedTitle);
});
