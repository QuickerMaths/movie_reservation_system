import { getQueryClient } from '@/providers/get-query-client';
import { fetchShowsSeatsById } from '@/api/shows';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import SeatPicker from '@/components/SeatPicker';
import ShowsContainer from '@/components/ShowsContainer';
import { fetchMovieDetailsById } from '@/api/movies';
import ReservationMoviePreview from '@/components/ReservationMoviePreview';

export default async function BookPage({
  params,
}: {
  params: { movieId: string; showId: string };
}) {
  const { movieId, showId } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => await fetchMovieDetailsById(movieId),
  });

  await queryClient.prefetchQuery({
    queryKey: ['showsSeats', showId],
    queryFn: async () => await fetchShowsSeatsById(showId),
  });

  return (
    <main className='min-h-screen bg-black text-white p-8 md:p-16'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start'>
          <div className='lg:col-span-8 w-full'>
            <h2 className='text-2xl font-bold mb-8'>Select Your Seats</h2>
            <SeatPicker showId={showId} />
          </div>

          <aside className='lg:col-span-4 w-full sticky top-8'>
            <ReservationMoviePreview movieId={movieId} />
            <ShowsContainer movieId={movieId} showId={showId} />
          </aside>
        </div>
      </HydrationBoundary>
    </main>
  );
}
