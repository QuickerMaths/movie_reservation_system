export interface IMovieGirdItem {
  id: number;
  title: string;
  posterImageUrl: string | null;
  cachedRating: number;
  durationMinutes: number | null;
  movieGenres: {
    name: string;
  };
}
