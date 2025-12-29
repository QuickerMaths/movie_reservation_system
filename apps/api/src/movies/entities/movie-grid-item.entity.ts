import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/client';

export class MovieGridItemEntity {
  @Expose({ name: 'id' })
  @ApiProperty({ name: 'id', example: 1, description: 'Unique identifier of the movie' })
  movie_id: number;

  @Expose()
  @ApiProperty({ example: 'The Matrix', description: 'Title of the movie' })
  title: string;

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

  @Expose({ name: 'movieGenres' }) // Keep the object structure your interface expects
  @ApiProperty({
    name: 'movieGenres',
    example: { name: 'Science Fiction' },
    description: 'Genre of the movie',
  })
  movie_genres: { name: string } | null;

  constructor(partial: Partial<MovieGridItemEntity>) {
    Object.assign(this, partial);
  }
}
