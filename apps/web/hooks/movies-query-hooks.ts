import { useQuery } from '@tanstack/react-query';
import { fetchMovieDetailsById, fetchMovies } from '@/api/movies';

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
