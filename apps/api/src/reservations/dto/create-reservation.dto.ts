import { IsEmail, IsInt, IsArray, IsOptional, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @IsInt()
  @ApiProperty({ example: 1 })
  show_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({
    type: [Number],
    example: [1, 2, 3],
  })
  seat_ids: number[];

  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com' })
  guest_email?: string;
}
