import { useQuery } from '@tanstack/react-query';
import { fetchMovieDetailsById, fetchMovies, fetchRecommendedMovies } from '@/api/movies';

export function useMoviesQueryHooks() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
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

export function useMovieRecommendedQuery(id: string) {
  return useQuery({
    queryKey: ['recommended-movies', id],
    queryFn: () => fetchRecommendedMovies(id),
    staleTime: 60 * 1000,
  });
}
