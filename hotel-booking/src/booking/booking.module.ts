/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from 'src/booking/booking.controller';
import { Booking } from 'src/booking/entities/booking.entity';
import { BookingService } from 'src/booking/booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
