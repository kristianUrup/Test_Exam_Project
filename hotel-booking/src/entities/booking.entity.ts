/* eslint-disable prettier/prettier */
import { Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Room } from './room.entity';

export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  isActive: boolean;

  @OneToOne((type) => Customer)
  customer: Customer;

  @OneToOne((type) => Room)
  room: Room;
}
