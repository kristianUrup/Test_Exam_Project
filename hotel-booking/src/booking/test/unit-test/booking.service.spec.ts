/* eslint-disable prettier/prettier */

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from '../../../room/entities/room.entity';
import { BookingService } from '../../booking.service';
import { Booking } from '../../entities/booking.entity';

describe('BookingService', () => {
  let bookingservice: BookingService;
  const bookingRepo = {};
  const roomRepo = {};
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
      const booking: Booking = null;
      const t = () => bookingservice.createBooking(booking);
      await expect(t).rejects.toThrow(Error);
      await expect(t).rejects.toThrow('Booking is null');
    });
  });
});
