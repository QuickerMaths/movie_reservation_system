import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../../generated/prisma/client';

type ReservationEntitySource = {
  reservation_id?: number;
  reservation_date?: Date | null;
  status?: ReservationStatus;
  user_id?: number | null;
  guest_emial?: string | null;
  guest_email?: string | null;
  cancellation_token?: string;
  show_id?: number | null;
};

export class ReservationEntity {
  @ApiProperty({ example: 1, description: 'Unique identifier of the reservation' })
  id: number;

  @ApiProperty({
    example: '2024-03-20T10:00:00Z',
    description: 'Reservation creation date',
  })
  date: Date;

  @ApiProperty({
    enum: ReservationStatus,
    example: ReservationStatus.PENDING,
    description: 'Reservation status',
  })
  status: ReservationStatus;

  @ApiProperty({
    example: 1,
    description:
      'Unique identifier of the user that made the reservation (this is optional for the guest users)',
  })
  userId: number | null;

  @ApiProperty({
    example: 'john.doe@example.com',
    description:
      'Email address used to send the confirmation email, if the users is not logged in.',
  })
  guestEmail: string | null;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description:
      'Token which allows canceling the reservation to the users that do not have the account.',
  })
  token: string;

  @ApiProperty({ example: 1, description: 'Unique identifier of the show' })
  showId: number | null;

  constructor(source: ReservationEntitySource) {
    this.id = source.reservation_id ?? 0;
    this.date = source.reservation_date ?? new Date(0);
    this.status = source.status ?? ReservationStatus.PENDING;
    this.userId = source.user_id ?? null;
    this.guestEmail = source.guest_emial ?? source.guest_email ?? null;
    this.token = source.cancellation_token ?? '';
    this.showId = source.show_id ?? null;
  }
}
