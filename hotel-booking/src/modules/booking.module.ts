/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from 'src/controllers/booking.controller';
import { Booking } from 'src/entities/booking.entity';
import { BookingService } from 'src/services/booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
