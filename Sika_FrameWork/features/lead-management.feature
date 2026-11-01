@leadManagement
Feature: Lead management in Leaftaps CRM

  Background:
    Given Load the Leaftaps login page
    When Enter the username as "Demosalesmanager"
    And Enter the password as "crmsfa"
    And Click on the Login button
    And Click on CRMSFA link

  Scenario: Create lead using the form
    When Click on the Leads tab
    And Click on the Create Lead link
    And Enter company name as "Testleaf"
    And Enter first name as "Bhuvanesh"
    And Enter last name as "Moorthy"
    And Enter phone number as "98127"
    And Click on Create Lead button
    Then Verify lead company name is "Testleaf"

  Scenario: Edit an existing lead
    When Click on the Leads tab
    And Click on the Create Lead link
    And Enter company name as "EditLeadCompany"
    And Enter first name as "EditLeadFirst"
    And Enter last name as "EditLeadLast"
    And Enter phone number as "98128"
    And Click on Create Lead button
    And Click on the Leads tab
    And Click on Find Leads link
    And Select Phone tab
    And Enter phone number as "98128"
    And Click on Find Leads button
    And Select the first lead result
    And Click on Edit link
    And Update company name to "Qeagle"
    And Click on Update button
    Then Verify lead company name is "Qeagle"

  Scenario: Duplicate an existing lead
    When Click on the Leads tab
    And Click on the Create Lead link
    And Enter company name as "DuplicateLeadCompany"
    And Enter first name as "DuplicateLeadFirst"
    And Enter last name as "DuplicateLeadLast"
    And Enter phone number as "98129"
    And Click on Create Lead button
    And Click on the Leads tab
    And Click on Find Leads link
    And Select Phone tab
    And Enter phone number as "98129"
    And Click on Find Leads button
    And Select the first lead result
    And Click on Duplicate Lead link
    And Verify duplicate lead creation form is displayed
    And Click on Create Lead button
    Then Verify lead company name is "DuplicateLeadCompany"

  Scenario: Delete an existing lead
    When Click on the Leads tab
    And Click on the Create Lead link
    And Enter company name as "DeleteLeadCompany"
    And Enter first name as "DeleteLeadFirst"
    And Enter last name as "DeleteLeadLast"
    And Enter phone number as "98130"
    And Click on Create Lead button
    And Click on the Leads tab
    And Click on Find Leads link
    And Select Phone tab
    And Enter phone number as "98130"
    And Click on Find Leads button
    And Select the first lead result
    And Store lead id
    And Click on Delete link
    And Click on Find Leads link
    And Search lead by id with stored lead id
    And Click on Find Leads button
    Then Verify no records to display
