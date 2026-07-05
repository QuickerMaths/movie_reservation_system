import {
  IGetMoviesQuery,
  IGetRecommendedMoviesQuery,
  IMovieDetail,
  IPaginatedMovies,
} from '@/types/movie';
import { apiFetch } from '@/lib/utils';

function appendQueryParams<T extends object>(params: URLSearchParams, query: T) {
  Object.entries(query as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    params.append(key, String(value));
  });
}

export function fetchMovies(query?: IGetMoviesQuery) {
  const params = new URLSearchParams();
  appendQueryParams(params, query ?? {});

  const queryString = params.toString();
  const path = queryString ? `/movies?${queryString}` : '/movies';

  return apiFetch<IPaginatedMovies>(path);
}

export function fetchMovieDetailsById(id: string) {
  return apiFetch<IMovieDetail>(`/movies/${id}`);
}

export function fetchRecommendedMovies(id: string, query?: IGetRecommendedMoviesQuery) {
  const params = new URLSearchParams();
  appendQueryParams(params, query ?? {});

  const queryString = params.toString();
  const path = queryString ? `/movies/${id}/recommended?${queryString}` : `/movies/${id}/recommended`;

  return apiFetch<IPaginatedMovies>(path);
}
