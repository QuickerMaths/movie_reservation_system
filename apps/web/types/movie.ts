export interface IMovieGirdItem {
  id: number;
  title: string;
  posterImageUrl: string | null;
  cachedRating: number;
  durationMinutes: number | null;
  genre: string;
}

export interface IMovieDetail {
  id: number;
  title: string;
  description: string;
  posterImageUrl: string | null;
  cachedRating: number;
  durationMinutes: number | null;
  lastShowDate: string | null;
  isRecommended: boolean;
  genre: string;
}
