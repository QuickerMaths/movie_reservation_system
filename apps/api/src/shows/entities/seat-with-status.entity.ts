import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '../../../generated/prisma/client';

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  TAKEN = 'TAKEN',
}

export type SeatWithRelations = Prisma.seatsGetPayload<{
  include: {
    seat_types: true;
    tickets: {
      include: {
        reservations: {
          select: { status: true };
        };
      };
    };
  };
}>;

export class SeatWithStatusEntity {
  @ApiProperty({ example: 1, description: 'Unique identifier of the seat' })
  id: number;

  @ApiProperty({ example: 'A', description: 'Row label' })
  row: string;

  @ApiProperty({ example: 1, description: 'Seat number' })
  seatNumber: number;

  @ApiProperty({ example: 'VIP', description: 'Type of the seat' })
  type: string;

  @ApiProperty({ example: 20.0, description: 'Price of the seat' })
  price: number;

  @ApiProperty({ enum: SeatStatus })
  @ApiProperty({ example: 'AVAILABLE', description: 'Status of the seat' })
  status: SeatStatus;

  constructor(seat: SeatWithRelations) {
    const activeTicket = seat.tickets?.[0];

    this.id = seat.seat_id;
    this.row = seat.row_label;
    this.seatNumber = seat.seat_number;
    this.type = seat.seat_types?.name ?? '';
    this.price = Number(seat.seat_types?.default_price ?? 0);
    this.status =
      !activeTicket || activeTicket.reservations?.status === 'CANCELLED'
        ? SeatStatus.AVAILABLE
        : SeatStatus.TAKEN;
  }
}
