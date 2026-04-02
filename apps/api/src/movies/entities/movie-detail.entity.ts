import { ApiProperty } from '@nestjs/swagger';

type MovieDetailSource = {
  movie_id: number;
  title: string;
  description: string | null;
  poster_image_url: string | null;
  cached_rating: unknown;
  duration_minutes: number;
  last_show_date: Date | null;
  is_recommended: boolean | null;
  movie_genres?: { name: string } | null;
};

export class MovieDetailEntity {
  @ApiProperty({ example: 1, description: 'Unique identifier of the movie' })
  id: number;

  @ApiProperty({ example: 'The Matrix', description: 'Title of the movie' })
  title: string;

  @ApiProperty({
    example:
      'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.',
    description: 'Description of the movie',
  })
  description: string;

  @ApiProperty({
    example: 'https://path-to-image.com',
    description: 'URL of the poster image',
    required: false,
  })
  posterImageUrl: string | null;

  @ApiProperty({
    example: 4.7,
    description: 'Cached average rating of the movie',
  })
  cachedRating: number;

  @ApiProperty({ example: 136, description: 'Duration in minutes' })
  durationMinutes: number;

  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    description: 'Last show date',
  })
  lastShowDate: Date | null;

  @ApiProperty({
    example: true,
    description: 'Indicates if the movie is recommended',
  })
  isRecommended: boolean;

  @ApiProperty({
    example: 'Science Fiction',
    description: 'Genre of the movie',
  })
  genre: string;

  constructor(movie: MovieDetailSource) {
    this.id = movie.movie_id;
    this.title = movie.title;
    this.description = movie.description ?? '';
    this.posterImageUrl = movie.poster_image_url ?? null;
    this.cachedRating = Number(movie.cached_rating ?? 0);
    this.durationMinutes = movie.duration_minutes;
    this.lastShowDate = movie.last_show_date ?? null;
    this.isRecommended = Boolean(movie.is_recommended);
    this.genre = movie.movie_genres?.name ?? '';
  }
}
