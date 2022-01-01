/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking/entities/booking.entity';
import { Customer } from './customer/entities/customer.entity';
import { Room } from './room/entities/room.entity';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [Customer, Room, Booking],
      synchronize: true,
    }),
  ],
  providers: [BookingModule],
})
export class AppModule {}
