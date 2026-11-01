import { Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../hooks/custom-world";

const leadsOf = (world: CustomWorld) => {
  if (!world.application) {
    throw new Error("Leaftaps application facade is not initialized");
  }
  return world.application.leads;
};

When("Create a unique source lead for merge", async function (this: CustomWorld) {
  await leadsOf(this).createUniqueMergeLead("source");
});

When("Create a unique target lead for merge", async function (this: CustomWorld) {
  await leadsOf(this).createUniqueMergeLead("target");
});

When("Open the first merge lead lookup", async function (this: CustomWorld) {
  await leadsOf(this).openMergeLookup(0);
});

When("Search for the source merge lead", async function (this: CustomWorld) {
  await leadsOf(this).searchMergeLead("source");
});

When("Select the source merge lead result", async function (this: CustomWorld) {
  await leadsOf(this).selectMergeLead("source");
});

When("Open the second merge lead lookup", async function (this: CustomWorld) {
  await leadsOf(this).openMergeLookup(1);
});

When("Search for the target merge lead", async function (this: CustomWorld) {
  await leadsOf(this).searchMergeLead("target");
});

When("Select the target merge lead result", async function (this: CustomWorld) {
  await leadsOf(this).selectMergeLead("target");
});

When("Merge the selected leads and confirm", async function (this: CustomWorld) {
  await leadsOf(this).mergeSelectedLeads();
});

When("Search lead by id with stored source merge lead id", async function (this: CustomWorld) {
  await leadsOf(this).searchForMergeLead("source");
});

When("Search lead by id with stored target merge lead id", async function (this: CustomWorld) {
  await leadsOf(this).searchForMergeLead("target");
});

Then("Verify the target merge lead remains after the merge", async function (this: CustomWorld) {
  await leadsOf(this).verifyTargetMergeLeadResult();
});
