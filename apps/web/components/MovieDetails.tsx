'use client';

import Image from 'next/image';
import { useMovieDetailsQuery } from '@/hooks/movies-query-hooks';

export default function MovieDetails({ id }: { id: string }) {
  const { data: movie, isLoading, isError } = useMovieDetailsQuery(id);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600' />
      </div>
    );
  }

  if (isError || !movie) {
    return <div className='text-red-500 text-center'>Error loading the movie.</div>;
  }

  return (
    <div className='md:col-span-8 md:grid md:grid-cols-7'>
      {/* Top Section: Grid Layout */}
      {/* Left Column: Thumbnail (Wireframe: "movie thumbnail") */}
      <div className='relative aspect-[2/3] w-full border border-gray-700 bg-gray-900 rounded-lg overflow-hidden md:col-span-3 mb-6 md:mb-0'>
        <Image
          src={movie.posterImageUrl || '/placeholder.png'}
          alt={movie.title}
          fill
          className='object-cover'
        />
      </div>
      {/* Middle Column: Details (Wireframe: Heading, Lorem ipsum, Genre...) */}
      <div className='flex flex-col gap-6 md:col-span-4 md:pl-8'>
        <h1 className='text-4xl font-bold'>{movie.title}</h1>
        <p className='text-gray-300 leading-relaxed'>{movie.description}</p>

        <div className='mt-auto space-y-2 text-sm text-gray-400'>
          <div className='flex justify-between border-b border-gray-800 py-2'>
            <span>Genre</span>
            <span className='text-white'>{movie.genre}</span>
          </div>
          <div className='flex justify-between border-b border-gray-800 py-2'>
            <span>Duration</span>
            <span className='text-white'>{movie.durationMinutes} min</span>
          </div>
          <div className='flex justify-between border-b border-gray-800 py-2'>
            <span>Rating</span>
            <span className='text-yellow-500 font-bold'>{movie.cachedRating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
