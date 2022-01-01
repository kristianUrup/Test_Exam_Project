/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Get(':id')
  async get(@Param() params, @Res({ passthrough: true }) res: Response) {
    const booking = await this.bookingService.get(params.id);
    if (booking == null) {
      res.status(HttpStatus.NOT_FOUND);
    } else {
      res.status(HttpStatus.OK);
      return booking;
    }
  }

  @Get()
  async getAll(@Res({ passthrough: true }) res: Response) {
    const bookings = await this.bookingService.getAll();
    res.status(HttpStatus.OK);
    return bookings;
  }

  @Post()
  async post(
    @Body() booking: Booking,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (booking == null) {
      res.status(HttpStatus.NOT_FOUND);
      return;
    }

    const created: boolean = await this.bookingService.createBooking(booking);

    if (created) {
      res.status(HttpStatus.OK);
      return;
    } else {
      res.status(HttpStatus.CONFLICT).statusMessage =
        'The booking could not be created. All rooms are occupied. Please try another period.';
      return;
    }
  }
}
