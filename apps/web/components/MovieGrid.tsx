'use client';

import { useMoviesQueryHooks } from '@/hooks/movies-query-hooks';
import MoviePreview from '@/components/MoviePreview';

export default function MovieGrid() {
  const { data: movies, isLoading, isError } = useMoviesQueryHooks();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600' />
      </div>
    );
  }

  if (isError || !movies) {
    return <div className='text-red-500 text-center'>Error loading movies.</div>;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
      {movies.map((movie, index) => (
        <MoviePreview key={index} movie={movie} size={'md'} />
      ))}
    </div>
  );
}
