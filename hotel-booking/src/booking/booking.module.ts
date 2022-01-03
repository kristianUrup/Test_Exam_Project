/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '../customer/customer.module';
import { RoomModule } from '../room/room.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), RoomModule, CustomerModule],
  exports: [TypeOrmModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
