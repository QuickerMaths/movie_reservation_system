import { ApiProperty } from '@nestjs/swagger';
import { shows } from '../../../generated/prisma/client';

export class ShowsMovieDetailEntity {
  @ApiProperty({ example: 1, description: 'Unique identifier of the show' })
  id: number;

  @ApiProperty({ example: '2024-07-01', description: 'Date key for grouping (YYYY-MM-DD)' })
  showDay: string;

  @ApiProperty({ example: '19:30', description: 'Formatted show time (HH:mm)' })
  showTime: string;

  constructor(show: shows) {
    const date = new Date(show.start_timestamp);

    this.id = show.show_id;
    this.showDay = date.toISOString().split('T')[0];
    this.showTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });
  }
}
