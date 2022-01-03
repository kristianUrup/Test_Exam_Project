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
    //Arrange
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

    //Act
    const response = await request(app.getHttpServer()).get(`/bookings/${id}`);

    //Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(bookingJson);
  });

  it('/POST booking was created', async () => {
    //Arrange
    const start = new Date();
    start.setDate(start.getDate() + 10);
    const end = new Date();
    end.setDate(end.getDate() + 20);

    const bookingJson = {
      customer: null,
      room: null,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      isActive: true,
    };
    const rooms: Room[] = [
      { id: 1, description: 'Nice room' },
      { id: 2, description: 'Big room' },
      { id: 3, description: 'Nice room with ocean view' },
    ];
    const bookings: Booking[] = [
      {
        id: 1,
        startDate: start,
        endDate: end,
        isActive: true,
        room: rooms[0],
        customer: null,
      },
      {
        id: 2,
        startDate: start,
        endDate: end,
        isActive: true,
        room: rooms[1],
        customer: null,
      },
    ];

    jest.spyOn(bookingRepo, 'find').mockImplementation(() => bookings);
    jest.spyOn(bookingRepo, 'create').mockImplementation();
    jest.spyOn(roomRepo, 'find').mockImplementation(() => rooms);

    //Act
    const response = await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingJson);

    //Assert
    expect(response.status).toBe(201);
    expect(response.text).toBe('Booking was succesfully created');
  });

  it('/POST booking could not be created', async () => {
    //Arrange
    const start = new Date();
    start.setDate(start.getDate() + 10);
    const end = new Date();
    end.setDate(end.getDate() + 20);

    const rooms: Room[] = [
      { id: 1, description: 'Nice room' },
      { id: 2, description: 'Big room' },
    ];
    const bookings: Booking[] = [
      {
        id: 1,
        startDate: start,
        endDate: end,
        isActive: true,
        room: rooms[0],
        customer: null,
      },
      {
        id: 2,
        startDate: start,
        endDate: end,
        isActive: true,
        room: rooms[1],
        customer: null,
      },
    ];

    const bookingJson = {
      customer: null,
      room: null,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      isActive: true,
    };

    jest.spyOn(bookingRepo, 'find').mockImplementation(() => bookings);
    jest.spyOn(bookingRepo, 'create').mockImplementation();
    jest.spyOn(roomRepo, 'find').mockImplementation(() => rooms);

    //Act
    const response = await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingJson);

    //Assert
    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
      'Already booked dates. Booking could not be created',
    );
  });

  it('/POST booking request is null', async () => {
    //Arrange
    const start = new Date();
    start.setDate(start.getDate() + 10);
    const end = new Date();
    end.setDate(end.getDate() + 20);

    const rooms: Room[] = [
      { id: 1, description: 'Nice room' },
      { id: 2, description: 'Big room' },
    ];
    const bookings: Booking[] = [
      {
        id: 1,
        startDate: start,
        endDate: end,
        isActive: true,
        room: rooms[0],
        customer: null,
      },
      {
        id: 2,
        startDate: start,
        endDate: end,
        isActive: true,
        room: rooms[1],
        customer: null,
      },
    ];

    const bookingJson = null;

    jest.spyOn(bookingRepo, 'find').mockImplementation(() => bookings);
    jest.spyOn(bookingRepo, 'create').mockImplementation();
    jest.spyOn(roomRepo, 'find').mockImplementation(() => rooms);

    //Act
    const response = await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingJson);

    //Assert
    expect(response.body.message).toBe('Booking body was invalid');
    expect(response.status).toBe(400);
  });
});
