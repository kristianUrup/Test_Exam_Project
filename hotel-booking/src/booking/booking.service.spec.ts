/* eslint-disable prettier/prettier */

import { Test } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

describe('BookingService', () => {
  let bookingservice: BookingService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BookingService],
    }).compile();

    bookingservice = moduleRef.get<BookingService>(BookingService);
  });

  describe('createBooking', () => {
    it('should throw an error if booking is null', async () => {
      const booking: Booking = null;

      expect(bookingservice.createBooking(booking)).toThrowError(
        'Booking is null',
      );
    });
  });
});
