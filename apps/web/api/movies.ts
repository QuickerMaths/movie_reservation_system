import { IMovieGirdItem, IMovieDetail } from '@/types/movie';
import { apiFetch } from '@/lib/utils';

export function fetchMovies() {
  return apiFetch<IMovieGirdItem[]>('/movies');
}

export function fetchMovieDetailsById(id: string) {
  return apiFetch<IMovieDetail>(`/movies/${id}`);
}

export function fetchRecommendedMovies(id: string) {
  return apiFetch<IMovieGirdItem[]>(`/movies/${id}/recommended`);
}
