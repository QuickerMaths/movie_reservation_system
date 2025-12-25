export interface IMovie {
  movie_id: number;
  title: string;
  description: string | null;
  poster_image_url: string | null;
  cached_rating: number;
  duration_minutes: number | null;
  last_show_date: Date;
  is_recommended: boolean;
  movie_genres: {
    genre_id: number;
    name: string;
  };
}
