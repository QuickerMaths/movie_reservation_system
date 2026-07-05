'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMoviesQueryHooks } from '@/hooks/movies-query-hooks';
import MoviePreview from '@/components/MoviePreview';
import PaginationControls from '@/components/PaginationControls';
import { IGetMoviesQuery } from '@/types/movie';
import { Button } from '@/components/ui/button';

type MovieFiltersFormValues = {
  q: string;
  genreId: string;
  minRating: string;
  isRecommended: boolean;
  sortBy: '' | NonNullable<IGetMoviesQuery['sortBy']>;
  sortOrder: NonNullable<IGetMoviesQuery['sortOrder']>;
};

const parseOptionalNumber = (value: string): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export default function MovieGrid() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Omit<IGetMoviesQuery, 'page' | 'limit'>>({});

  const { register, handleSubmit, reset } = useForm<MovieFiltersFormValues>({
    defaultValues: {
      q: '',
      genreId: '',
      minRating: '',
      isRecommended: false,
      sortBy: '',
      sortOrder: 'asc',
    },
  });

  const query = useMemo<IGetMoviesQuery>(
    () => ({
      page,
      limit: 12,
      ...filters,
    }),
    [filters, page],
  );

  const { data: moviesResponse, isLoading, isError, isFetching } = useMoviesQueryHooks(query);

  const onSubmit = (values: MovieFiltersFormValues) => {
    setPage(1);
    setFilters({
      q: values.q || undefined,
      genreId: parseOptionalNumber(values.genreId),
      minRating: parseOptionalNumber(values.minRating),
      isRecommended: values.isRecommended || undefined,
      sortBy: values.sortBy || undefined,
      sortOrder: values.sortOrder,
    });
  };

  const clearFilters = () => {
    reset({
      q: '',
      genreId: '',
      minRating: '',
      isRecommended: false,
      sortBy: '',
      sortOrder: 'asc',
    });
    setPage(1);
    setFilters({});
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600' />
      </div>
    );
  }

  if (isError || !moviesResponse) {
    return <div className='text-red-500 text-center'>Error loading movies.</div>;
  }

  const movies = moviesResponse.data;

  return (
    <div className='space-y-8'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='rounded-lg border border-gray-800 bg-gray-900/50 p-4'
      >
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <input
            {...register('q')}
            placeholder='Search title...'
            className='h-10 rounded-md border border-gray-700 bg-gray-950 px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600'
          />
          <input
            {...register('genreId')}
            type='number'
            min={1}
            placeholder='Genre ID'
            className='h-10 rounded-md border border-gray-700 bg-gray-950 px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600'
          />
          <input
            {...register('minRating')}
            type='number'
            min={0}
            max={10}
            step='0.1'
            placeholder='Min rating (0-10)'
            className='h-10 rounded-md border border-gray-700 bg-gray-950 px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600'
          />
          <select
            {...register('sortBy')}
            className='h-10 rounded-md border border-gray-700 bg-gray-950 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600'
          >
            <option value=''>Sort by (default)</option>
            <option value='title'>Title</option>
            <option value='cachedRating'>Rating</option>
            <option value='durationMinutes'>Duration</option>
            <option value='lastShowDate'>Last show date</option>
          </select>
          <select
            {...register('sortOrder')}
            className='h-10 rounded-md border border-gray-700 bg-gray-950 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600'
          >
            <option value='asc'>Ascending</option>
            <option value='desc'>Descending</option>
          </select>
          <label className='flex items-center gap-2 rounded-md border border-gray-700 bg-gray-950 px-3 text-sm text-gray-200'>
            <input {...register('isRecommended')} type='checkbox' className='h-4 w-4' />
            Recommended only
          </label>
        </div>
        <div className='mt-4 flex gap-2'>
          <Button type='submit' className='bg-red-600 hover:bg-red-700'>
            Apply filters
          </Button>
          <Button type='button' variant='outline' onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </form>

      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {movies.map((movie) => (
          <MoviePreview key={movie.id} movie={movie} size={'md'} />
        ))}
      </div>

      <PaginationControls
        page={moviesResponse.meta.page}
        totalPages={moviesResponse.meta.totalPages}
        totalItems={moviesResponse.meta.total}
        onPreviousAction={() => setPage((prev) => Math.max(prev - 1, 1))}
        onNextAction={() =>
          setPage((prev) => Math.min(prev + 1, Math.max(moviesResponse.meta.totalPages, 1)))
        }
        isLoading={isFetching}
      />
    </div>
  );
}
