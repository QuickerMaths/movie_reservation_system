import { IPaginationMeta } from '@/types/pagination';

export interface IMovieGirdItem {
  id: number;
  title: string;
  posterImageUrl: string | null;
  cachedRating: number;
  durationMinutes: number | null;
  genre: string;
}

export interface IPaginatedMovies {
  data: IMovieGirdItem[];
  meta: IPaginationMeta;
}

export interface IGetMoviesQuery {
  page?: number;
  limit?: number;
  genreId?: number;
  q?: string;
  minRating?: number;
  isRecommended?: boolean;
  sortBy?: 'title' | 'cachedRating' | 'durationMinutes' | 'lastShowDate';
  sortOrder?: 'asc' | 'desc';
}

export interface IGetRecommendedMoviesQuery {
  page?: number;
  limit?: number;
  genreId?: number;
  minRating?: number;
  sortBy?: 'cachedRating' | 'title' | 'lastShowDate';
  sortOrder?: 'asc' | 'desc';
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
