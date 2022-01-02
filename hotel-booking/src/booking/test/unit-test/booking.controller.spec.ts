/* eslint-disable prettier/prettier */
import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BookingController } from '../../booking.controller';
import { BookingService } from '../../booking.service';
import { Booking } from '../../entities/booking.entity';

describe('BookingController', () => {
  let bookingController: BookingController;
  const bookingService = {
    getAll: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [{ provide: BookingService, useValue: bookingService }],
    }).compile();

    bookingController = moduleRef.get<BookingController>(BookingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('Return OK status and list of bookings', async () => {
      //Arrange
      const array: Booking[] = [];
      const getAllBooking = jest
        .spyOn(bookingService, 'getAll')
        .mockImplementation(async () => array);

      //Act
      const result = await bookingController.getAll();

      //Assert
      expect(result).toBe(array);
      expect(getAllBooking).toBeCalled();
    });
  });

  describe('get', () => {
    it('Booking is found and returned', async () => {
      //Arrange
      const id = 1;
      const booking = new Booking();

      const getBooking = jest
        .spyOn(bookingService, 'get')
        .mockImplementation(() => booking);

      //Act
      const result = await bookingController.get(id);

      //Assert
      expect(result).toBe(booking);
      expect(result != null).toBeTruthy();
      expect(getBooking).toBeCalled();
    });
  });
});
