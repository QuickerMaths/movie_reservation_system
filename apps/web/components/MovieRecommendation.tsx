'use client';

import MoviePreview from '@/components/MoviePreview';
import { useMovieRecommendedQuery } from '@/hooks/movies-query-hooks';

export default function MovieRecommendation({ id }: { id: string }) {
  const { data: recommendedMovies, isLoading, isError } = useMovieRecommendedQuery(id);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-32'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600' />
      </div>
    );
  }

  if (isError || !recommendedMovies) {
    return <div className='text-red-500 text-center'>Error loading recommendations.</div>;
  }

  // TODO: Add pagination

  return (
    <section className='md:col-start-1 md:col-end-12'>
      <h3 className='text-center text-xl font-semibold mb-8 text-gray-200'>Recommended movies</h3>
      <div className='grid gap-8'>
        {recommendedMovies.map((movie, index) => (
          <MoviePreview key={index} movie={movie} size={'sm'} />
        ))}
      </div>
    </section>
  );
}
