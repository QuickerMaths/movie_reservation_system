import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../../generated/prisma/client';

export class PaymentEntity {
  @Expose({ name: 'status' })
  @ApiProperty({
    name: 'status',
    example: 'PAID',
    description: 'Indicates if the payment was successfully',
  })
  status: ReservationStatus;

  constructor(partial: Partial<PaymentEntity>) {
    Object.assign(this, partial);
  }
}
