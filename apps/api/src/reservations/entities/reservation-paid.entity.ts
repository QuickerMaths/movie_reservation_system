import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '../../../generated/prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import { ReservationStatus } from '../../../generated/prisma/client';

export type ReservationWithRelations = Prisma.reservationsGetPayload<{
  include: {
    users: true;
    shows: {
      include: {
        movies: true;
        movie_rooms: true;
      };
    };
    tickets: {
      include: {
        seats: {
          include: {
            seat_types: true;
          };
        };
      };
    };
  };
}>;

function toNumber(value: Decimal | number): number {
  return value instanceof Decimal ? value.toNumber() : Number(value);
}

export class ReservationDetailEntity {
  @ApiProperty({
    name: 'id',
    example: 1,
    description: 'ID of the reservation',
  })
  id: number;

  @ApiProperty({
    example: '2023-10-24T14:30:00.000Z',
    description: 'ISO 8601 timestamp of when the reservation was made',
  })
  reservationDate: string;

  @ApiProperty({
    enum: ReservationStatus,
    example: ReservationStatus.PAID,
    description: 'Current status of the reservation',
  })
  status: ReservationStatus;

  @ApiProperty({
    required: false,
    example: 'john.doe@example.com',
    description: 'Email address of the registered user or guest booking the reservation',
  })
  email: string | undefined;

  @ApiProperty({
    example: 'Dune: Part Two',
    description: 'Title of the movie',
  })
  movieTitle: string;

  @ApiProperty({
    nullable: true,
    example: 'https://example.com/assets/posters/dune2.jpg',
    description: 'URL pointing to the movie poster image',
  })
  posterImageUrl: string | null;

  @ApiProperty({
    example: 'Room 4',
    description: 'Identifier or number of the cinema room',
  })
  roomNumber: string;

  @ApiProperty({
    example: '2023-10-25T19:00:00.000Z',
    description: 'ISO 8601 timestamp of the show start time',
  })
  startTime: string;

  @ApiProperty({
    example: 166,
    description: 'Total duration of the movie in minutes',
  })
  durationMinutes: number;

  @ApiProperty({
    description: 'List of tickets included in the reservation',
    example: [
      {
        ticketId: 1042,
        soldPrice: 15.5,
        seat: {
          row: 'F',
          number: 12,
          type: 'VIP',
        },
      },
      {
        ticketId: 1043,
        soldPrice: 15.5,
        seat: {
          row: 'F',
          number: 13,
          type: 'VIP',
        },
      },
    ],
  })
  tickets: Array<{
    ticketId: number;
    soldPrice: number;
    seat: {
      row: string;
      number: number;
      type: string;
    };
  }>;

  @ApiProperty({
    example: 31.0,
    description: 'Total combined price of all tickets in the reservation',
  })
  totalPrice: number;

  constructor(reservation: ReservationWithRelations) {
    const mappedTickets = reservation.tickets.map((ticket) => ({
      ticketId: ticket.ticket_id,
      soldPrice: toNumber(ticket.sold_price),
      seat: {
        row: ticket.seats?.row_label ?? '',
        number: ticket.seats?.seat_number ?? 0,
        type: ticket.seats?.seat_types?.name ?? '',
      },
    }));

    this.id = reservation.reservation_id;
    this.reservationDate = reservation.reservation_date?.toISOString() ?? '';
    this.status = reservation.status;
    this.email = reservation.users?.email ?? reservation.guest_emial ?? undefined; // Note: 'guest_emial' typo in original code
    this.movieTitle = reservation.shows?.movies?.title ?? '';
    this.posterImageUrl = reservation.shows?.movies?.poster_image_url ?? null;
    this.roomNumber = reservation.shows?.movie_rooms?.room_number ?? '';
    this.startTime = reservation.shows?.start_timestamp?.toISOString() ?? '';
    this.durationMinutes = reservation.shows?.movies?.duration_minutes ?? 0;
    this.tickets = mappedTickets;
    this.totalPrice = mappedTickets.reduce((sum, ticket) => sum + ticket.soldPrice, 0);
  }
}
