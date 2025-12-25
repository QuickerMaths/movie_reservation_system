import { IMovie } from '@/types/movie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchMovies(): Promise<IMovie[]> {
  const res = await fetch(`${API_URL}/movies`);

  if (!res.ok) {
    throw new Error(`Failed to fetch movies: ${res.statusText} (${res.status})`);
  }

  return res.json();
}
