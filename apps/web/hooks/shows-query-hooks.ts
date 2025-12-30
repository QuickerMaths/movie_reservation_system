import { useQuery } from '@tanstack/react-query';
import { fetchShowsByMovieId } from '@/api/shows';

export function useShowsByMovieIdQuery(movieId: string, date: string) {
  return useQuery({
    queryKey: ['shows', movieId, date],
    queryFn: () => fetchShowsByMovieId(+movieId, date),
    staleTime: 60 * 1000,
  });
}
