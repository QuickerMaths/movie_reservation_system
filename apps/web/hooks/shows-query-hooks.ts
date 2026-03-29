import { useQuery } from '@tanstack/react-query';
import { fetchShowsByMovieId, fetchShowsSeatsById } from '@/api/shows';

export function useShowsByMovieIdQuery(movieId: string, date: string) {
  return useQuery({
    queryKey: ['shows', movieId, date],
    queryFn: () => fetchShowsByMovieId(+movieId, date),
    staleTime: 60 * 1000,
  });
}

export function useShowsSeatsIdQuery({ showId }: { showId: string }) {
  return useQuery({
    queryKey: ['showsSeats', showId],
    queryFn: () => fetchShowsSeatsById(showId),
    staleTime: 60 * 1000,
  });
}
