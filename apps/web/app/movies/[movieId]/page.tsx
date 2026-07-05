import MovieDetails from '@/components/MovieDetails';
import { getQueryClient } from '@/providers/get-query-client';
import { fetchMovieDetailsById, fetchRecommendedMovies } from '@/api/movies';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import MovieRecommendation from '@/components/MovieRecommendation';
import { fetchShowsByMovieId } from '@/api/shows';
import ShowsContainer from '@/components/ShowsContainer';

export default async function MoviePage({ params }: { params: { movieId: string } }) {
  const { movieId } = await params;
  const queryClient = getQueryClient();
  const recommendedQuery = { page: 1, limit: 8 };

  await queryClient.prefetchQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => await fetchMovieDetailsById(movieId),
  });

  await queryClient.prefetchQuery({
    queryKey: ['recommended-movies', movieId, recommendedQuery],
    queryFn: async () => await fetchRecommendedMovies(movieId, recommendedQuery),
  });

  await queryClient.prefetchQuery({
    queryKey: ['shows', movieId, new Date().toISOString().split('T')[0]],
    queryFn: async () => fetchShowsByMovieId(+movieId, new Date().toISOString().split('T')[0]),
  });

  return (
    <main className='min-h-screen bg-black text-white p-8 md:p-16'>
      <div className='grid grid-cols-1 md:grid-cols-12 gap-8 mb-16'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MovieDetails id={movieId} />
          <div className='col-span-1 mt-10 md:col-span-4 md:mt-0'>
            <ShowsContainer movieId={movieId} />
          </div>
          <MovieRecommendation id={movieId} />
        </HydrationBoundary>
      </div>
    </main>
  );
}
