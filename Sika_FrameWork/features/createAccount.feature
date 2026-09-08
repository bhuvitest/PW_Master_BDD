Feature: Create Account in Leaftaps CRM

  Background:
    Given Load the Leaftaps login page
    When Enter the username as "democsr"
    And Enter the password as "crmsfa"
    And Click on the Login button
 
  @CreateAccount
  Scenario: Verify account creation functionality in Leaftaps
    When Click on CRMSFA link
    And Click on the Accounts tab
    And Click on the Create Account button
    And Enter account name as "Matt bommer"
    And Enter description as "Playwright Automation Tester"
    And Enter number of employees as "1082"
    And Enter site name as "Leaftaps"
    And Click on Create Account button
    Then Verify that the title contains "Account Details" after account is created