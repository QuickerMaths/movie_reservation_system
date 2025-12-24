import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchMovies } from './api/movies';
import MovieGrid from '@/app/client-components/MovieGrid';
import { getQueryClient } from '@/app/providers/get-query-client';

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
  });

  return (
    <main className='min-h-screen bg-gray-950 text-white p-8'>
      <header className='mb-12'>
        <h1 className='text-4xl font-bold text-red-600 mb-2'>CinemaPlus</h1>
        <p className='text-gray-400'>Book your tickets for the latest hits.</p>
      </header>

      <section>
        <h2 className='text-2xl font-semibold mb-6 border-l-4 border-red-600 pl-3'>Now Showing</h2>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <MovieGrid />
        </HydrationBoundary>
      </section>
    </main>
  );
}
