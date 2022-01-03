/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking/entities/booking.entity';
import { Customer } from './customer/entities/customer.entity';
import { Room } from './room/entities/room.entity';
import { BookingModule } from './booking/booking.module';
import { RoomModule } from './room/room.module';
import { Connection } from 'typeorm';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      autoLoadEntities: true,
    }),
    BookingModule,
    RoomModule,
    CustomerModule,
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
