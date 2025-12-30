import { IShows } from '@/types/shows';
import { apiFetch } from '@/lib/utils';

export function fetchShowsByMovieId(movieId: number, date: string) {
  const params = new URLSearchParams();
  params.append('date', date);

  return apiFetch<IShows[]>(`/shows/${movieId}?${params.toString()}`);
}
