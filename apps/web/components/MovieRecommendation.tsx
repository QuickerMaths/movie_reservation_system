'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import MoviePreview from '@/components/MoviePreview';
import { useMovieRecommendedQuery } from '@/hooks/movies-query-hooks';
import { IGetRecommendedMoviesQuery } from '@/types/movie';
import PaginationControls from '@/components/PaginationControls';
import { Button } from '@/components/ui/button';

type RecommendedFiltersFormValues = {
  genreId: string;
  minRating: string;
  sortBy: '' | NonNullable<IGetRecommendedMoviesQuery['sortBy']>;
  sortOrder: NonNullable<IGetRecommendedMoviesQuery['sortOrder']>;
};

const parseOptionalNumber = (value: string): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export default function MovieRecommendation({ id }: { id: string }) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Omit<IGetRecommendedMoviesQuery, 'page' | 'limit'>>({});

  const { register, handleSubmit, reset } = useForm<RecommendedFiltersFormValues>({
    defaultValues: {
      genreId: '',
      minRating: '',
      sortBy: '',
      sortOrder: 'desc',
    },
  });

  const query = useMemo<IGetRecommendedMoviesQuery>(
    () => ({
      page,
      limit: 8,
      ...filters,
    }),
    [filters, page],
  );

  const {
    data: recommendedMoviesResponse,
    isLoading,
    isError,
    isFetching,
  } = useMovieRecommendedQuery(id, query);

  const onSubmit = (values: RecommendedFiltersFormValues) => {
    setPage(1);
    setFilters({
      genreId: parseOptionalNumber(values.genreId),
      minRating: parseOptionalNumber(values.minRating),
      sortBy: values.sortBy || undefined,
      sortOrder: values.sortOrder,
    });
  };

  const clearFilters = () => {
    reset({
      genreId: '',
      minRating: '',
      sortBy: '',
      sortOrder: 'desc',
    });
    setPage(1);
    setFilters({});
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-32'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600' />
      </div>
    );
  }

  if (isError || !recommendedMoviesResponse) {
    return <div className='text-red-500 text-center'>Error loading recommendations.</div>;
  }

  const recommendedMovies = recommendedMoviesResponse.data;

  return (
    <section className='md:col-start-1 md:col-end-12'>
      <h3 className='text-center text-xl font-semibold mb-8 text-gray-200'>Recommended movies</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mb-6 rounded-lg border border-gray-800 bg-gray-900/50 p-4'
      >
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
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
            <option value='cachedRating'>Rating</option>
            <option value='title'>Title</option>
            <option value='lastShowDate'>Last show date</option>
          </select>
          <select
            {...register('sortOrder')}
            className='h-10 rounded-md border border-gray-700 bg-gray-950 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600'
          >
            <option value='desc'>Descending</option>
            <option value='asc'>Ascending</option>
          </select>
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

      <div className='grid gap-8'>
        {recommendedMovies.map((movie) => (
          <MoviePreview key={movie.id} movie={movie} size={'sm'} />
        ))}
      </div>

      <PaginationControls
        page={recommendedMoviesResponse.meta.page}
        totalPages={recommendedMoviesResponse.meta.totalPages}
        totalItems={recommendedMoviesResponse.meta.total}
        onPreviousAction={() => setPage((prev) => Math.max(prev - 1, 1))}
        onNextAction={() =>
          setPage((prev) => Math.min(prev + 1, Math.max(recommendedMoviesResponse.meta.totalPages, 1)))
        }
        isLoading={isFetching}
      />
    </section>
  );
}
