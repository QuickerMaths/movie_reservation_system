import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../../generated/prisma/client';

export class ReservationEntity {
  @Expose({ name: 'id' })
  @ApiProperty({ name: 'id', example: 1, description: 'Unique identifier of the reservation' })
  reservation_id: number;

  @Expose({ name: 'date' })
  @ApiProperty({
    name: 'date',
    example: '2024-03-20T10:00:00Z',
    description: 'Reservation creation date',
  })
  reservation_date: Date;

  @Expose({ name: 'status' })
  @ApiProperty({
    enum: ReservationStatus,
    example: ReservationStatus.PENDING,
    description: 'Reservation status',
  })
  status: ReservationStatus;

  @Expose({ name: 'userId' })
  @ApiProperty({
    name: 'userId',
    example: 1,
    description:
      'Unique identifier of the user that made the reservation (this is optional for the guest users)',
  })
  user_id: number;

  @Expose({ name: 'guestEmail' })
  @ApiProperty({
    name: 'guestEmail',
    example: 'john.doe@example.com',
    description:
      'Email address used to send the confirmation email, if the users is not logged in.',
  })
  guest_email: string;

  @Expose({ name: 'token' })
  @ApiProperty({
    name: 'token',
    example: '550e8400-e29b-41d4-a716-446655440000',
    description:
      'Token which allows canceling the reservation to the users that do not have the account.',
  })
  cancellation_token: string;

  @Expose({ name: 'showId' })
  @ApiProperty({ name: 'showId', example: 1, description: 'Unique identifier of the show' })
  show_id: number;

  constructor(partial: Partial<ReservationEntity>) {
    Object.assign(this, partial);
  }
}
