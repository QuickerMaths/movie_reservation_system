import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../../generated/prisma/client';

export class ReservationEntity {
  @Expose({ name: 'id' })
  @ApiProperty({ example: '1' })
  reservation_id: number;

  @Expose({ name: 'date' })
  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  reservation_date: Date;

  @Expose()
  @ApiProperty({ enum: ReservationStatus, example: ReservationStatus.PENDING })
  status: ReservationStatus;

  @Expose({ name: 'userId' })
  @ApiProperty({ example: 1 })
  user_id: number;

  @Expose({ name: 'guestEmail' })
  @ApiProperty({ example: 'john.doe@example.com' })
  guest_email: string;

  @Expose({ name: 'token' })
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  cancellation_token: string;

  @Expose({ name: 'showId' })
  @ApiProperty({ example: 1 })
  show_id: number;

  constructor(partial: Partial<ReservationEntity>) {
    Object.assign(this, partial);
  }
}
