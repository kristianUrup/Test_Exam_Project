Feature: Create Booking
  
  Scenario: Create A Booking With Start Date Before Today
    Given the booking period starts before today
    When the booking is placed
    Then booking not placed and exception is thrown


  Scenario: Create A Booking With StartDate After EndDate
    Given the booking it starts before it ends
    When the booking is placed
    Then booking not placed and exception is thrown

  Scenario: Create A Booking before an occupied period
    Given the booking starts before an occupied period
    And the booking ends before an occupied period
    When the booking is placed
    Then it should be created successfully

  Scenario: Create A Booking after an occupied period
    Given the booking starts after an occupied period
    And the booking ends after an occupied period
    When the booking is placed
    Then it should be created successfully

  Scenario: Create A Booking before and after a occupied period
    Given the booking starts before an occupied period
    And the booking ends after an occupied period
    When the booking is placed
    Then it should not be created

  Scenario: Create A Booking where end is in occupied period
    Given the booking starts before an occupied period
    And the booking ends in an occupied period
    When the booking is placed
    Then it should not be created

  Scenario: Create A Booking where start is in occupied period
    Given the booking starts in an occupied period
    And the booking ends after an occupied period
    When the booking is placed
    Then it should not be created

  Scenario: Create A Booking where start and end is in occupied period
    Given the booking starts in an occupied period
    And the booking ends after an occupied period
    When the booking is placed
    Then it should not be created


