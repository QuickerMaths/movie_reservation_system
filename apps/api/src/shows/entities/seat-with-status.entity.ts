import { Exclude, Expose, Transform } from 'class-transformer';
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
  @Expose({ name: 'id' })
  @ApiProperty({ name: 'id', example: 1, description: 'Unique identifier of the seat' })
  seat_id: number;

  @Expose({ name: 'row' })
  @ApiProperty({ name: 'row', example: 'A', description: 'Row label' })
  row_label: string;

  @Expose({ name: 'seatNumber ' })
  @ApiProperty({ name: 'seatNumber', example: 1, description: 'Seat number' })
  seat_number: number;

  @Expose({ name: 'type' })
  @ApiProperty({ name: 'type', example: 'VIP', description: 'Type of the seat' })
  @Transform(({ obj }: { obj: SeatWithRelations }) => {
    return obj.seat_types.name;
  })
  type: string;

  @Expose({ name: 'price' })
  @ApiProperty({ name: 'price', example: 20.0, description: 'Price of the seat' })
  @Transform(({ obj }: { obj: SeatWithRelations }) => {
    return obj.seat_types.default_price;
  })
  price: number;

  @Expose({ name: 'status' })
  @ApiProperty({ enum: SeatStatus })
  @ApiProperty({ name: 'status', example: 'AVAILABLE', description: 'Status of the seat' })
  @Transform(({ obj }: { obj: SeatWithRelations }) => {
    const activeTicket = obj.tickets?.[0];

    if (!activeTicket) return SeatStatus.AVAILABLE;
    return activeTicket.reservations?.status === 'CANCELLED'
      ? SeatStatus.AVAILABLE
      : SeatStatus.TAKEN;
  })
  status: SeatStatus;

  @Exclude()
  seat_types: any;

  @Exclude()
  tickets: any[];

  constructor(partial: Partial<SeatWithStatusEntity>) {
    Object.assign(this, partial);
  }
}
