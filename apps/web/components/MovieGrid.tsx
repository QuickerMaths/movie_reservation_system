'use client';

import Image from 'next/image';
import { useMovies } from '@/hooks/use-movies';

export default function MovieGrid() {
  const { data: movies, isLoading, isError } = useMovies();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600' />
      </div>
    );
  }

  if (isError || !movies) {
    return <div className='text-red-500 text-center'>Error loading movies.</div>;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
      {movies.map((movie) => (
        <article
          key={movie.movie_id}
          className='group bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-xl'
        >
          {/* Poster Image */}
          <div className='relative aspect-[2/3] w-full'>
            <Image
              src={movie.poster_image_url || '/image_placeholder.png'}
              alt={movie.title}
              fill
              className='object-cover group-hover:opacity-80 transition-opacity'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>

          {/* Movie Details */}
          <div className='p-4'>
            <div className='flex justify-between items-start mb-2'>
              <h3 className='text-xl font-bold truncate pr-2'>{movie.title}</h3>
              <span className='bg-gray-800 text-xs px-2 py-1 rounded text-gray-300 whitespace-nowrap'>
                {movie.duration_minutes} min
              </span>
            </div>

            <p className='text-gray-400 text-sm line-clamp-2 mb-4'>{movie.description}</p>

            <div className='flex justify-between items-center mt-auto'>
              <span className='text-sm text-red-500 font-medium'>
                {movie.movie_genres?.name || 'Genre'}
              </span>
              <button className='bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-full font-medium transition-colors'>
                Book
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
