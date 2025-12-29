import MovieDetails from '@/components/MovieDetails';
import { getQueryClient } from '@/providers/get-query-client';
import { fetchMovieDetailsById } from '@/api/movies';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function MoviePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['movie', id],
    queryFn: async () => await fetchMovieDetailsById(id),
  });

  return (
    <main className='min-h-screen bg-black text-white p-8 md:p-16'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MovieDetails id={id} />
      </HydrationBoundary>
    </main>
  );
}
