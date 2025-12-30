import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { shows } from '../../../generated/prisma/client';

export class ShowsMovieDetailEntity {
  @Expose({ name: 'id' })
  @ApiProperty({ name: 'id', example: 1, description: 'Unique identifier of the show' })
  show_id: number;

  @Expose()
  @ApiProperty({ example: '2024-07-01', description: 'Date key for grouping (YYYY-MM-DD)' })
  @Transform(({ obj }: { obj: shows }) => {
    const date = new Date(obj.start_timestamp);
    return date.toISOString().split('T')[0];
  })
  showDay: string;

  @Expose()
  @ApiProperty({ example: '19:30', description: 'Formatted show time (HH:mm)' })
  @Transform(({ obj }: { obj: shows }) => {
    const date = new Date(obj.start_timestamp);

    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });
  })
  showTime: string;

  @Exclude()
  movie_id: number;

  @Exclude()
  start_timestamp: Date;

  @Exclude()
  movie_room_id: number;

  constructor(partial: Partial<ShowsMovieDetailEntity>) {
    Object.assign(this, partial);
  }
}
