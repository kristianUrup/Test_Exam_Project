Feature: CreateBooking


  Scenario: Create A Booking With Start Date Before Today
    Given the booking period starts before today
    When the booking is placed
    Then booking not placed and exception is thrown
