import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../api/movies';

export function useMovies() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    staleTime: 60 * 1000,
  });
}
