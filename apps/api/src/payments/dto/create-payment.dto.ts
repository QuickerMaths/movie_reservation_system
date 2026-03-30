import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../../generated/prisma/client';

export class CreatePaymentDto {
  @IsInt()
  @ApiProperty({ example: 1 })
  reservation_id: number;

  @ApiProperty({ example: 'PAID' })
  result: ReservationStatus;

  @IsInt()
  @ApiProperty({ example: 25.0 })
  amount: number;
}
