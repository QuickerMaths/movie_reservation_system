import { useQuery } from '@tanstack/react-query';
import { fetchMovieDetailsById, fetchMovies, fetchRecommendedMovies } from '@/api/movies';
import { IGetMoviesQuery, IGetRecommendedMoviesQuery } from '@/types/movie';

export function useMoviesQueryHooks(query?: IGetMoviesQuery) {
  const normalizedQuery = {
    page: 1,
    limit: 12,
    ...query,
  };

  return useQuery({
    queryKey: ['movies', normalizedQuery],
    queryFn: () => fetchMovies(normalizedQuery),
    staleTime: 60 * 1000,
  });
}

export function useMovieDetailsQuery(id: string) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieDetailsById(id),
    staleTime: 60 * 1000,
  });
}

export function useMovieRecommendedQuery(id: string, query?: IGetRecommendedMoviesQuery) {
  const normalizedQuery = {
    page: 1,
    limit: 8,
    ...query,
  };

  return useQuery({
    queryKey: ['recommended-movies', id, normalizedQuery],
    queryFn: () => fetchRecommendedMovies(id, normalizedQuery),
    staleTime: 60 * 1000,
  });
}
