import { IMovieGirdItem } from '@/types/movie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchMovies(): Promise<IMovieGirdItem[]> {
  const url = new URL('/movies', API_URL);

  const res = await fetch(url.toString());

  if (!res.ok) {
    let errorMessage = `Error ${res.status}: ${res.statusText}`;
    try {
      const errorBody = await res.json();
      errorMessage = errorBody.message || errorMessage;
    } catch {}

    throw new Error(errorMessage);
  }

  return (await res.json()) as Promise<IMovieGirdItem[]>;
}
