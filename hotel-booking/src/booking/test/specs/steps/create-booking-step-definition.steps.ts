/* eslint-disable prettier/prettier */
import {defineFeature, loadFeature} from 'jest-cucumber';
import {Test} from '@nestjs/testing';
import {BookingService} from '../../../booking.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Booking} from '../../../entities/booking.entity';
import {Room} from '../../../../room/entities/room.entity';

const feature = loadFeature(
    './src/booking/test/specs/features/CreateBooking.feature',
);

const today = new Date(2022, 1, 1);


// Occupied is from 5th of February to the 10th of February
const before = new Date(2022, 2, 4);
const occupied = new Date(2022, 2, 5);
const after = new Date(2022, 2, 11);

let bookingService: BookingService;
const bookingRepo = {find: jest.fn(), create: jest.fn((b) => b)};
const roomRepo = {find: jest.fn()};

beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [
            BookingService,
            {
                provide: getRepositoryToken(Booking),
                useValue: bookingRepo,
            },
            {
                provide: getRepositoryToken(Room),
                useValue: roomRepo,
            },
        ],
    }).compile();

    bookingService = moduleRef.get<BookingService>(BookingService);
});

defineFeature(feature, (test) => {
    let bookingStart = new Date();
    bookingStart.setDate(new Date().getDate() + 10);
    let bookingEnd = new Date();
    bookingEnd.setDate(new Date().getDate() + 20);
    let result: any;

    const rooms: Room[] = [
        {id: 1, description: 'A'},
        {id: 2, description: 'B'},
    ];

    const bookings: Booking[] = [
        {
            id: 1,
            startDate: bookingStart,
            endDate: bookingEnd,
            isActive: true,
            room: rooms[0],
            customer: null,
        },
        {
            id: 2,
            startDate: bookingStart,
            endDate: bookingEnd,
            isActive: true,
            room: rooms[1],
            customer: null,
        },
    ];

    //Shared GIVEN
    const GIVEN_bookingPeriodStartsBeforeToday = (given) => {
        given('the booking period starts before today', () => {
            bookingStart = new Date(2021, 1, 30);
            bookingEnd = new Date(2022, 1, 5);
        });
    };

    const GIVEN_bookingStartsBeforeItEnds = (given) => {
        given('the booking it starts before it ends', () => {
            bookingStart = new Date(2022, 1, 30);
            bookingEnd = new Date(2022, 1, 20);
        })
    }

    const GIVEN_bookingStartsBeforeAnOccupiedPeriod = (given) => {
        given('the booking starts before an occupied period', () => {
            bookingStart = new Date();
            bookingStart.setDate(occupied.getDate() - 10);
        });
    }

    const GIVEN_bookingStartsAfterAnOccupiedPeriod = (given) => {
        given('the booking starts after an occupied period', () => {
            bookingStart = new Date();
            bookingStart.setDate(after.getDate() + 10);
        })
    }


    const GIVEN_bookingStartsInOccupiedPeriod = (given) => {
        given('the booking starts in an occupied period', () => {
            bookingStart = new Date();
            bookingStart.setDate(occupied.getDate());
        })
    }

    // Shared AND
    const AND_bookingEndsBeforeAnOccupiedPeriod = (and) => {
        and('the booking ends before an occupied period', () => {
            bookingEnd = new Date()
            bookingEnd.setDate(occupied.getDate() - 1);
        })
    }

    const AND_bookingEndsAfterOccupiedPeriod = (and) => {
        and('the booking ends after an occupied period', () => {
            bookingEnd = new Date();
            bookingEnd.setDate(after.getDate() + 20);
        })
    }

    const AND_bookingEndsInOccupiedPeriod = (and) => {
        and('the booking ends in an occupied period', () => {
            bookingEnd = new Date();
            bookingEnd.setDate(occupied.getDate());
        })
    }

    // Shared WHEN
    const WHEN_bookingIsPlaced = (when) =>
        when('the booking is placed', () => {
            result = () => bookingService.createBooking(bookings[0]);
        });

    //Shared THEN
    const THEN_bookingNotPlacedAndExceptionIsThrown = (then, exceptionMessage: string) =>
        then('booking not placed and exception is thrown', () => {
            expect(result).rejects.toThrowError(Error);
            expect(result).rejects.toThrowError(
                exceptionMessage
            );
        });

    const THEN_shouldBeCreatedPerfectly = (then) => {
        then('it should be created successfully', () => {
            expect(result).toBeDefined();
        })
    }

    // it should not be created
    const THEN_shouldNotBeCreated = (then) => {
        then('it should not be created', () => {
            expect(result).rejects.toBeFalsy();
        })
    }


    test('Create A Booking With Start Date Before Today', ({
                                                               given,
                                                               when,
                                                               then,
                                                           }) => {

        GIVEN_bookingPeriodStartsBeforeToday(given);

        WHEN_bookingIsPlaced(when);

        THEN_bookingNotPlacedAndExceptionIsThrown(then, 'The start date cannot be in the past or later than the end date');
    });
    test('Create A Booking With StartDate After EndDate', ({given, when, then}) => {

        GIVEN_bookingStartsBeforeItEnds(given);

        WHEN_bookingIsPlaced(when);

        THEN_bookingNotPlacedAndExceptionIsThrown(then, 'Start date is after end date and throws error');
    });

    test('Create A Booking before an occupied period', ({given, and, when, then}) => {
        GIVEN_bookingStartsBeforeAnOccupiedPeriod(given);

        AND_bookingEndsBeforeAnOccupiedPeriod(and);

        WHEN_bookingIsPlaced(when);

        THEN_shouldBeCreatedPerfectly(then);
    });

    test('Create A Booking after an occupied period', ({given, and, when, then}) => {

        GIVEN_bookingStartsAfterAnOccupiedPeriod(given);

        AND_bookingEndsAfterOccupiedPeriod(and);

        WHEN_bookingIsPlaced(when);

        THEN_shouldBeCreatedPerfectly(then);
    });

    test('Create A Booking before and after a occupied period', ({given, and, when, then}) => {
        GIVEN_bookingStartsBeforeAnOccupiedPeriod(given);

        AND_bookingEndsAfterOccupiedPeriod(and);

        WHEN_bookingIsPlaced(when);

        THEN_shouldNotBeCreated(then);
    });

    test('Create A Booking where end is in occupied period', ({given, and, when, then}) => {
        GIVEN_bookingStartsBeforeAnOccupiedPeriod(given);

        AND_bookingEndsInOccupiedPeriod(and);

        WHEN_bookingIsPlaced(when);

        THEN_shouldNotBeCreated(then);
    });

    test('Create A Booking where start is in occupied period', ({given, and, when, then}) => {
        GIVEN_bookingStartsInOccupiedPeriod(given);

        AND_bookingEndsAfterOccupiedPeriod(and);

        WHEN_bookingIsPlaced(when);

        THEN_shouldNotBeCreated(then);
    });

    test('Create A Booking where start and end is in occupied period', ({given, and, when, then}) => {
        GIVEN_bookingStartsInOccupiedPeriod(given);

        AND_bookingEndsAfterOccupiedPeriod(and);

        WHEN_bookingIsPlaced(when);

        THEN_shouldNotBeCreated(then);
    })
});
