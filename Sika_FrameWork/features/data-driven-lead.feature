@dataDriven
Feature: Create leads using JSON test data

  Background:
    Given Load test data from "users.json" collection "users" at index 0
    And Load the Leaftaps login page
    When Enter the username as "{{username}}"
    And Enter the password as "{{password}}"
    And Click on the Login button
    And Click on CRMSFA link

  Scenario: Create a lead using a JSON data record
    When Click on the Leads tab
    And Click on the Create Lead link
    And Enter company name as "{{companyName}}"
    And Enter first name as "{{firstName}}"
    And Enter last name as "{{lastName}}"
    And Click on Create Lead button
    Then Verify lead company name is "{{companyName}}"
