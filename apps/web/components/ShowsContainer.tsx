'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showsFilterSchema, ShowsFilterValues } from '@/schemas/shows-filter.schema';
import { useShowsByMovieIdQuery } from '@/hooks/shows-query-hooks';

interface ShowsContainerProps {
  movieId: string;
}

export default function ShowsContainer({ movieId }: ShowsContainerProps) {
  const { setValue, control, register } = useForm<ShowsFilterValues>({
    resolver: zodResolver(showsFilterSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const selectedDate = useWatch({
    control,
    name: 'date',
  });
  const dateToUse = selectedDate || new Date();

  const dateString = dateToUse.toISOString().split('T')[0];

  const { data: shows, isLoading, isError } = useShowsByMovieIdQuery(movieId, dateString);

  const handleSetToday = () => setValue('date', new Date());
  const handleSetTomorrow = () => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    setValue('date', tmr);
  };

  const isToday = (d: Date) =>
    d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
  const isTomorrow = (d: Date) => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return d.toISOString().split('T')[0] === tmr.toISOString().split('T')[0];
  };

  return (
    <section className='col-span-1 mt-10 md:col-span-4 md:mt-0'>
      <h3 className='text-2xl font-bold mb-6'>Screenings</h3>

      <div className='flex flex-wrap gap-6 border-b border-gray-800 pb-4 mb-8 items-center'>
        {/* Today Tab */}
        <button
          type='button'
          onClick={handleSetToday}
          className={`cursor-pointer pb-1 transition-all ${
            isToday(dateToUse)
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Today
        </button>

        {/* Tomorrow Tab */}
        <button
          type='button'
          onClick={handleSetTomorrow}
          className={`cursor-pointer pb-1 transition-all ${
            isTomorrow(dateToUse)
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Tomorrow
        </button>

        {/* "Some Day" Date Picker */}
        <div className='relative flex items-center gap-2'>
          <span className='text-gray-400'>Pick a date:</span>
          <input
            type='date'
            {...register('date', { valueAsDate: true })}
            className='cursor-pointer bg-transparent text-white border border-gray-700 rounded p-1 text-sm focus:outline-none focus:border-white'
          />
        </div>
      </div>

      {/* Results */}
      <div className='min-h-[150px]'>
        {isLoading && <p className='text-gray-500'>Loading showtimes...</p>}
        {isError && <p className='text-red-500'>Error loading showtimes.</p>}

        {!isLoading && shows?.length === 0 && (
          <p className='text-gray-500'>No screenings scheduled for this date.</p>
        )}

        {!isLoading && shows && shows.length > 0 && (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {shows.map((show) => (
              <button
                key={show.id}
                className='cursor-pointer group flex flex-col items-center justify-center py-3 px-4 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-white hover:text-black transition-all'
              >
                <p className='text-lg font-bold'>{show.showTime}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
