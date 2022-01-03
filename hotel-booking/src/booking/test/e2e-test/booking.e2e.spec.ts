/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from '../../../room/entities/room.entity';
import { BookingService } from '../../booking.service';
import { Booking } from '../../entities/booking.entity';
import * as request from 'supertest';
import { BookingController } from '../../booking.controller';

describe('Booking', () => {
  let app: INestApplication;
  let bookingService: BookingService;
  const bookingRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };
  const roomRepo = {
    find: jest.fn(),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: bookingRepo,
        },
        {
          provide: getRepositoryToken(Room),
          useValue: roomRepo,
        },
      ],
    }).compile();

    bookingService = moduleRef.get<BookingService>(BookingService);
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('/GET bookings', async () => {
    //Arrange
    jest.spyOn(bookingRepo, 'find').mockImplementation(() => []);

    //Act
    const response = await request(app.getHttpServer()).get('/bookings');

    //Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(bookingService.getAll());
  });

  it('/GET booking not found', async () => {
    //Arrange
    jest.spyOn(bookingRepo, 'findOne').mockImplementation(() => null);

    //Act
    const response = await request(app.getHttpServer()).get('/bookings/1');

    //Assert
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Booking was not found');
  });

  it('/GET booking was found', async () => {
    const id = 1;
    const booking: Booking = {
      id: id,
      customer: null,
      room: null,
      startDate: new Date(),
      endDate: new Date(),
      isActive: true,
    };
    const bookingJson = {
      id: booking.id,
      customer: booking.customer,
      room: booking.room,
      startDate: booking.startDate.toISOString(),
      endDate: booking.startDate.toISOString(),
      isActive: booking.isActive,
    };
    jest.spyOn(bookingRepo, 'findOne').mockImplementation(() => booking);
    const response = await request(app.getHttpServer()).get(`/bookings/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(bookingJson);
  });
});
