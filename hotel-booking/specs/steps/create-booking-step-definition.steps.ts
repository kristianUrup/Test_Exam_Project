import { defineFeature, loadFeature} from "jest-cucumber";
import {Test} from "@nestjs/testing";
import {BookingService} from "../../src/booking/booking.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Booking} from "../../src/booking/entities/booking.entity";
import {Given, When, Then} from "cucumber";
import {Room} from "../../src/room/entities/room.entity";

const feature = loadFeature('./specs/features/CreateBooking.feature');

const today = new Date(2022,1,1);

// Occupied is from 5th of February to the 10th of February
const before = new Date(2022,2,4);
const occupied = new Date(2022,2,5);
const after = new Date(2022,2,11);

let bookingService: BookingService;
const bookingRepo = { find: jest.fn(), create: jest.fn((b) => b) };
const roomRepo = { find: jest.fn() };

let bookingStart = new Date();
let bookingEnd = new Date();
let result: any;

const rooms: Room[] = [
    { id: 1, description: 'A' },
    { id: 2, description: 'B' },
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

jest.spyOn(bookingRepo, 'find').mockImplementation(() => bookings);
jest.spyOn(roomRepo, 'find').mockImplementation(() => rooms);





    Given(/^the booking period starts before today$/, function (callback) {
        bookingStart = new Date(2021, 1, 30);
        bookingEnd = new Date(2022, 1, 5);
        return callback();
    })

    When('the booking is placed', function (callback) {
        result = bookingService.findAvailableRoom(bookingStart, bookingEnd);
        return callback();
    })

    Then('booking not placed and exception is thrown', function (callback) {
        expect(result).rejects.toThrowError(Error)
        expect(result).rejects.toThrowError('The start date cannot be in the past or later than the end date');
    })

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

/*
defineFeature(feature, (test) => {

    let isBooked = false;
    let bookingStart = new Date();
    let bookingEnd = new Date();
    let result: any;

    //Shared GIVEN
    const bookingPeriodStartsBeforeToday = (given) => {
        given('the booking period starts before today', () => {
            bookingStart = new Date(2021,1,30);
            bookingEnd = new Date(2022,1,5);
        })
    }

    // Shared WHEN
    const bookingIsPlaced = (when) =>
        when('the booking is placed', () => {
        bookingService.findAvailableRoom(bookingStart, bookingEnd);
    })

    //Shared THEN

    const bookingNotPlacedAndExceptionIsThrown = (then) =>
        then('booking not placed and exception is thrown', () =>{
        expect(result).rejects.toThrowError(Error)
        expect(result).rejects.toThrowError('The start date cannot be in the past or later than the end date');
    })


    test('Create A Booking With Start Date Before Today', ({given,when,then}) => {

        const start = new Date();
        start.setDate(start.getDate() + 1);
        const end = new Date();
        end.setDate(end.getDate() + 20);

        const rooms: Room[] = [
            { id: 1, description: 'A' },
            { id: 2, description: 'B' },
        ];

        const bookings: Booking[] = [
            {
                id: 1,
                startDate: start,
                endDate: end,
                isActive: true,
                room: rooms[0],
                customer: null,
            },
            {
                id: 2,
                startDate: start,
                endDate: end,
                isActive: true,
                room: rooms[1],
                customer: null,
            },
        ];


        bookingPeriodStartsBeforeToday(given);

        bookingIsPlaced(when);

        bookingNotPlacedAndExceptionIsThrown(then);
    })
})


*/

