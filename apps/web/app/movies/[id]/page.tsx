import MovieDetails from '@/components/MovieDetails';
import { getQueryClient } from '@/providers/get-query-client';
import { fetchMovieDetailsById, fetchRecommendedMovies } from '@/api/movies';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import MovieRecommendation from '@/components/MovieRecommendation';

export default async function MoviePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['movie', id],
    queryFn: async () => await fetchMovieDetailsById(id),
  });

  await queryClient.prefetchQuery({
    queryKey: ['recommended-movies', id],
    queryFn: async () => await fetchRecommendedMovies(id),
  });

  return (
    <main className='min-h-screen bg-black text-white p-8 md:p-16'>
      <div className='grid grid-cols-1 md:grid-cols-12 gap-8 mb-16'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MovieDetails id={id} />
          <MovieRecommendation id={id} />
        </HydrationBoundary>
      </div>
    </main>
  );
}
