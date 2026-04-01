import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CancelReservationDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Cancellation token for guest users',
  })
  cancellation_token?: string;
}
