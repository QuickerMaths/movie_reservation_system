import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../../generated/prisma/client';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { toOptionalNumber } from '../../../helpers/helpers';

export const reservationSortFields = ['reservationDate', 'status'] as const;

export type ReservationSortField = (typeof reservationSortFields)[number];

export class GetUserReservationsDto {
  @ApiProperty({ example: 1, minimum: 1 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ enum: ReservationStatus, example: ReservationStatus.PENDING })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiProperty({ example: '2026-04-02T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({ example: '2026-04-30T23:59:59.999Z' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({ enum: reservationSortFields, example: 'reservationDate' })
  @IsOptional()
  @IsIn(reservationSortFields)
  sortBy?: ReservationSortField;

  @ApiProperty({ enum: ['asc', 'desc'], example: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
