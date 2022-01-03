/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from '../../../room/entities/room.entity';
import { BookingService } from '../../booking.service';
import { Booking } from '../../entities/booking.entity';
import * as request from 'supertest';

describe('Booking', () => {
  let app: INestApplication;
  let bookingService: BookingService;
  const bookingRepo = {
    find: jest.fn(),
    create: jest.fn((b) => b),
  };
  const roomRepo = {
    find: jest.fn(),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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

  it('/GET bookings', () => {
    return request(app.getHttpServer()).get('/bookings').expect(200);
  });
});
