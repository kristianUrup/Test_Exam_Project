/* eslint-disable prettier/prettier */

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from '../../../room/entities/room.entity';
import { BookingService } from '../../booking.service';
import { Booking } from '../../entities/booking.entity';

describe('BookingService', () => {
  let bookingservice: BookingService;
  const bookingRepo = { find: jest.fn(), create: jest.fn((b) => b) };
  const roomRepo = { find: jest.fn() };
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

    bookingservice = moduleRef.get<BookingService>(BookingService);
  });

  describe('createBooking', () => {
    it('should throw an error if booking is null', async () => {
      //Arrange
      const start = new Date();
      start.setDate(start.getDate() + 10);
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
      const booking: Booking = null;
      const bookRepoFind = jest
        .spyOn(bookingRepo, 'find')
        .mockImplementation(() => bookings);
      const bookRepoCreate = jest
        .spyOn(bookingRepo, 'create')
        .mockImplementation((booking) => booking);
      jest.spyOn(roomRepo, 'find').mockImplementation(() => rooms);

      //Act
      const t = () => bookingservice.createBooking(booking);

      //Assert
      await expect(t).rejects.toThrow(Error);
      await expect(t).rejects.toThrow('Booking is null');
      expect(bookRepoFind).toHaveBeenCalledTimes(0);
      expect(bookRepoCreate).toHaveBeenCalledTimes(0);
    });
  });

  describe('createBooking', () => {
    it('booking is succesfull and returns true', async () => {
      //Arrange
      const bookingStartDate = new Date();
      bookingStartDate.setDate(bookingStartDate.getDate() + 1);
      const bookingEndDate = new Date();
      bookingEndDate.setDate(bookingEndDate.getDate() + 2);
      const start = new Date();
      start.setDate(start.getDate() + 10);
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

      jest.spyOn(bookingRepo, 'find').mockImplementation(() => bookings);
      jest.spyOn(roomRepo, 'find').mockImplementation(() => rooms);

      const booking = new Booking();
      booking.startDate = bookingStartDate;
      booking.endDate = bookingEndDate;

      //Act
      const result = await bookingservice.createBooking(booking);

      expect(result).toBeTruthy();
    });
  });

  describe('createBooking', () => {
    it('booking is unsuccesful and returns false', async () => {
      //Arrange
      const bookingStartDate = new Date();
      bookingStartDate.setDate(bookingStartDate.getDate() + 1);
      const bookingEndDate = new Date();
      bookingEndDate.setDate(bookingEndDate.getDate() + 2);
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

      jest.spyOn(bookingRepo, 'find').mockImplementation(() => bookings);
      jest.spyOn(roomRepo, 'find').mockImplementation(() => rooms);

      const booking = new Booking();
      booking.startDate = bookingStartDate;
      booking.endDate = bookingEndDate;

      //Act
      const result = await bookingservice.createBooking(booking);

      expect(result).toBeFalsy();
    });
  });
});
