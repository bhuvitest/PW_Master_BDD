Feature: Create Lead in Leaftaps CRM

 Background:
    Given Load the Leaftaps login page
    When Enter the username as "democsr"
    And Enter the password as "crmsfa"
    And Click on the Login button
 
  @CreateLead
  Scenario Outline: Verify create lead functionality in Leaftaps
    When Click on CRMSFA link
    And Click on the Leads tab
    And Click on the Create Lead link
    And Enter company name as "<companyName>"
    And Enter first name as "<firstName>"
    And Enter last name as "<lastName>"
    And Enter title as "<title>"
    And Click on Create Lead button
    Then Verify that the title contains "View" after lead is created

    Examples:
      | companyName | firstName | lastName | title           |
      | TestLeaf    | Hari      | R        |  Vice President |
      | Qeagle    | Bhuvanesh | Moorthy   | Automation Tester |