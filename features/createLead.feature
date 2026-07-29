Feature: Create Lead in Leaftaps CRM

 Background:
    Given Load the Leaftaps login page
    When Enter the username as "demosalesmanager"
    And Enter the password as "crmsfa"
    And Click on the Login button
 
  @CreateLead
  Scenario: Verify create lead functionality in Leaftaps
    When Click on CRMSFA link
    And Click on the Leads tab
    And Click on the Create Lead link
    And Enter company name as "TestLeaf"
    And Enter first name as "Hari"
    And Enter last name as "R"
    And Enter title as "Testleaf Tester"
    And Click on Create Lead button
    Then Verify that the title contains "View" after lead is created

     @CreateLead
  Scenario: Verify create lead functionality in Leaftaps
    When Click on CRMSFA link
    And Click on the Leads tab
    And Click on the Create Lead link
    And Enter company name as "TestLeaf"
    And Enter first name as "Dilip"
    And Enter last name as "kumar"
    And Enter title as "Testleaf Tester"
    And Click on Create Lead button
    Then Verify that the title contains "View" after lead is created