import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchMovies } from '@/api/movies';
import MovieGrid from '@/components/MovieGrid';
import { getQueryClient } from '@/providers/get-query-client';

export default async function MoviesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
  });

  return (
    <main className='min-h-screen bg-gray-950 text-white p-8'>
      <section>
        <h2 className='text-2xl font-semibold mb-6 border-l-4 border-red-600 pl-3'>Now Showing</h2>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <MovieGrid />
        </HydrationBoundary>
      </section>
    </main>
  );
}
