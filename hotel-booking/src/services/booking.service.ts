/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Room } from 'src/entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,
  ) {}

  async createBooking(booking: Booking): Promise<boolean> {
    if (booking == null) {
      throw new Error('Booking is null');
    }

    const room: Room = await this.findAvailableRoom(
      booking.startDate,
      booking.endDate,
    );

    if (room) {
      booking.room = room;
      booking.isActive = true;
      this.bookingRepo.create(booking);
      return true;
    } else {
      return false;
    }
  }

  async findAvailableRoom(startDate: Date, endDate: Date): Promise<Room> {
    const today: Date = new Date();
    if (startDate <= today || startDate > endDate) {
      throw new Error(
        'The start date cannot be in the past or later than the end date',
      );
    }

    const activeBookings = await this.bookingRepo.find({
      where: { isActive: true },
    });
    const rooms = await this.roomRepo.find();
    rooms.forEach((room) => {
      const activeBookingsForCurrentRooms = activeBookings.filter(
        (b) => b.room.id == room.id,
      );
      if (
        activeBookingsForCurrentRooms.every(
          (b) =>
            (startDate < b.startDate && endDate < b.startDate) ||
            (startDate > b.endDate && endDate > b.endDate),
        )
      ) {
        return room;
      }
    });
    return null;
  }

  getAll(): Promise<Booking[]> {
    return this.bookingRepo.find();
  }

  get(id: number): Promise<Booking> {
    return this.bookingRepo.findOne(id);
  }
}
