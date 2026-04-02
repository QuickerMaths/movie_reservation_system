import { ApiProperty } from '@nestjs/swagger';
import { MovieGridItem } from '../movies.selectors';

export class MovieGridItemEntity {
  @ApiProperty({ example: 1, description: 'Unique identifier of the movie' })
  id: number;

  @ApiProperty({ example: 'The Matrix', description: 'Title of the movie' })
  title: string;

  @ApiProperty({
    example: 'https://path-to-image.com',
    description: 'URL of the poster image',
  })
  @ApiProperty({ required: false, nullable: true })
  posterImageUrl: string | null;

  @ApiProperty({
    example: 4.7,
    description: 'Cached average rating of the movie',
  })
  cachedRating: number;

  @ApiProperty({ example: 136, description: 'Duration in minutes' })
  durationMinutes: number;

  @ApiProperty({
    example: 'Science Fiction',
    description: 'Genre of the movie',
  })
  genre: string;

  constructor(movie: MovieGridItem) {
    this.id = movie.movie_id;
    this.title = movie.title;
    this.posterImageUrl = movie.poster_image_url ?? null;
    this.cachedRating = Number(movie.cached_rating ?? 0);
    this.durationMinutes = movie.duration_minutes;
    this.genre = movie.movie_genres?.name ?? '';
  }
}
