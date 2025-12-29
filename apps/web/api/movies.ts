import { IMovieGirdItem, IMovieDetail } from '@/types/movie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Generic API Fetcher
 * Handles URL construction, error parsing, and type casting.
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = new URL(endpoint, API_URL);

  const res = await fetch(url.toString(), options);

  if (!res.ok) {
    let errorMessage = `Error ${res.status}: ${res.statusText}`;
    try {
      const errorBody = await res.json();
      errorMessage = errorBody.message || errorMessage;
    } catch {
      // Ignore JSON parse errors on error responses
    }
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}

// --- Exported API Methods ---

export function fetchMovies() {
  return apiFetch<IMovieGirdItem[]>('/movies');
}

export function fetchMovieDetailsById(id: string) {
  return apiFetch<IMovieDetail>(`/movies/${id}`);
}

export function fetchRecommendedMovies(id: string) {
  return apiFetch<IMovieGirdItem[]>(`/movies/${id}/recommended`);
}
