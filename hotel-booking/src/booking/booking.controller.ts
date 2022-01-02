/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Get(':id')
  async get(@Param('id') id: number) {
    const booking = await this.bookingService.get(id);
    if (booking == null) {
      throw new NotFoundException('Booking was not found');
    } else {
      return booking;
    }
  }

  @Get()
  async getAll() {
    const bookings = await this.bookingService.getAll();
    return bookings;
  }

  @Post()
  async post(@Body() booking: Booking) {
    if (booking == null) {
      throw new BadRequestException('Booking body was invalid');
    }

    const created: boolean = await this.bookingService.createBooking(booking);

    if (created) {
      return 'Booking was succesfully created';
    } else {
      throw new BadRequestException(
        'Already booked dates. Booking could not be created',
      );
    }
  }
}
