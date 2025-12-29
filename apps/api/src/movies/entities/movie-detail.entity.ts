import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/client';

export class MovieDetailEntity {
  @Expose({ name: 'id' })
  @ApiProperty({ name: 'id', example: 1, description: 'Unique identifier of the movie' })
  movie_id: number;

  @Expose()
  @ApiProperty({ example: 'The Matrix', description: 'Title of the movie' })
  title: string;

  @Expose()
  @ApiProperty({
    example:
      'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.',
    description: 'Description of the movie',
  })
  description: string;

  @Expose({ name: 'posterImageUrl' })
  @ApiProperty({
    name: 'posterImageUrl',
    example: 'https://path-to-image.com',
    description: 'URL of the poster image',
  })
  @ApiProperty({ required: false, nullable: true })
  poster_image_url: string | null;

  @Expose({ name: 'cachedRating' })
  @ApiProperty({
    name: 'cachedRating',
    example: 4.7,
    description: 'Cached average rating of the movie',
  })
  @Transform(({ value }) => (value as Decimal).toNumber())
  cached_rating: number | Decimal;

  @Expose({ name: 'durationMinutes' })
  @ApiProperty({ name: 'durationMinutes', example: 136, description: 'Duration in minutes' })
  duration_minutes: number;

  @Expose({ name: 'lastShowDate' })
  @ApiProperty({
    name: 'lastShowDate',
    example: '2024-12-31T23:59:59Z',
    description: 'Last show date',
  })
  last_show_date: Date | null;

  @Expose({ name: 'isRecommended' })
  @ApiProperty({
    name: 'isRecommended',
    example: true,
    description: 'Indicates if the movie is recommended',
  })
  is_recommended: boolean;

  @Expose({ name: 'movieGenres' })
  @ApiProperty({
    name: 'movieGenres',
    example: { name: 'Science Fiction' },
    description: 'Genre of the movie',
  })
  movie_genres: { name: string } | null;

  constructor(partial: Partial<MovieDetailEntity>) {
    Object.assign(this, partial);
  }
}
