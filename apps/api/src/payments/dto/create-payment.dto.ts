import { IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../../generated/prisma/client';

export class CreatePaymentDto {
  @IsInt()
  @ApiProperty({ example: 1 })
  reservation_id: number;

  @IsEnum(ReservationStatus)
  @ApiProperty({ example: ReservationStatus.PAID })
  result: ReservationStatus;

  @IsInt()
  @ApiProperty({ example: 25.0 })
  amount: number;
}
