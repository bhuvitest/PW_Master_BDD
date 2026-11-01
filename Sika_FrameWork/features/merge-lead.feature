@MergeLead
Feature: Merge leads in Leaftaps CRM

  Background:
    Given Load the Leaftaps login page
    When Enter the username as "Demosalesmanager"
    And Enter the password as "crmsfa"
    And Click on the Login button
    And Click on CRMSFA link

  Scenario: Merge two leads
    When Create a unique source lead for merge
    And Create a unique target lead for merge
    And Click on the Leads tab
    And Click on Merge Leads link
    And Open the first merge lead lookup
    And Search for the source merge lead
    And Select the source merge lead result
    And Open the second merge lead lookup
    And Search for the target merge lead
    And Select the target merge lead result
    And Merge the selected leads and confirm
    And Click on Find Leads link
    And Search lead by id with stored source merge lead id
    And Click on Find Leads button
    Then Verify no records to display
    When Search lead by id with stored target merge lead id
    And Click on Find Leads button
    Then Verify the target merge lead remains after the merge
