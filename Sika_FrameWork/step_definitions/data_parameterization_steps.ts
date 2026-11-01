import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../hooks/custom-world";
import { readJsonRecord } from "../utils/data-reader";

Given(
  "Load test data from {string} collection {string} at index {int}",
  function (this: CustomWorld, fileName: string, collectionName: string, recordIndex: number) {
    this.testData = readJsonRecord(fileName, collectionName, recordIndex);
  }
);
