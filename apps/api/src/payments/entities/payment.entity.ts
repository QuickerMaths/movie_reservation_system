import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../../generated/prisma/client';

export class PaymentEntity {
  @ApiProperty({
    example: 'PAID',
    description: 'Indicates if the payment was successfully',
  })
  status: ReservationStatus;

  constructor(partial: Partial<PaymentEntity>) {
    this.status = partial.status ?? ReservationStatus.CANCELLED;
  }
}
