/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BookingController } from '../../booking.controller';
import { BookingService } from '../../booking.service';
import { Booking } from '../../entities/booking.entity';

describe('BookingController', () => {
  let bookingController: BookingController;
  const bookingService = {
    getAll: jest.fn(),
    get: jest.fn(),
    createBooking: jest.fn(),
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
    it('Return list of bookings', async () => {
      //Arrange
      const array: Booking[] = [];
      const getAllBooking = jest
        .spyOn(bookingService, 'getAll')
        .mockImplementation(async () => array);

      //Act
      const result = await bookingController.getAll();

      //Assert
      expect(result).toEqual(array);
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
      expect(result).toEqual(booking);
      expect(result != null).toBeTruthy();
      expect(getBooking).toBeCalled();
    });

    it('Booking is not found and NotFoundException is thrown', async () => {
      //Arrange
      const id = 1;
      const booking = null;

      const getBooking = jest
        .spyOn(bookingService, 'get')
        .mockImplementation(() => booking);

      //Act
      const t = () => bookingController.get(id);

      //Assert
      expect(t).rejects.toThrow(NotFoundException);
      expect(t).rejects.toThrow('Booking was not found');
      expect(getBooking).toBeCalled();
    });
  });

  describe('post', () => {
    it('Booking is created', async () => {
      //Arrange
      const booking = new Booking();

      const createBooking = jest
        .spyOn(bookingService, 'createBooking')
        .mockImplementation(() => true);

      //Act
      const result = await bookingController.post(booking);

      //Assert
      expect(result).toBe('Booking was succesfully created');
      expect(createBooking).toBeCalled();
    });

    it('Body is null and BadRequestException is thrown', async () => {
      //Arrange
      const booking = null;

      const createBooking = jest
        .spyOn(bookingService, 'createBooking')
        .mockImplementation(() => false);

      //Act
      const t = () => bookingController.post(booking);

      //Assert
      await expect(t).rejects.toThrow(BadRequestException);
      await expect(t).rejects.toThrow('Booking body was invalid');
      expect(createBooking).toBeCalledTimes(0);
    });

    it('Could not create booking and BadRequestException is thrown', async () => {
      //Arrange
      const booking = new Booking();
      const createBooking = jest
        .spyOn(bookingService, 'createBooking')
        .mockImplementation(() => false);

      //Act
      const t = () => bookingController.post(booking);

      //Assert
      await expect(t).rejects.toThrow(ConflictException);
      await expect(t).rejects.toThrow(
        'Already booked dates. Booking could not be created',
      );
      expect(createBooking).toBeCalled();
    });
  });
});
