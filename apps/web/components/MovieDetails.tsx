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
    <>
      {/* Top Section: Grid Layout */}
      <div className='grid grid-cols-1 md:grid-cols-12 gap-8 mb-16'>
        {/* Left Column: Thumbnail (Wireframe: "movie thumbnail") */}
        <div className='md:col-span-3'>
          <div className='relative aspect-[2/3] w-full border border-gray-700 bg-gray-900 rounded-lg overflow-hidden'>
            <Image
              src={movie.posterImageUrl || '/placeholder.png'}
              alt={movie.title}
              fill
              className='object-cover'
            />
          </div>
        </div>

        {/* Middle Column: Details (Wireframe: Heading, Lorem ipsum, Genre...) */}
        <div className='md:col-span-5 flex flex-col gap-6'>
          <h1 className='text-4xl font-bold'>{movie.title}</h1>
          <p className='text-gray-300 leading-relaxed'>{movie.description}</p>

          <div className='mt-auto space-y-2 text-sm text-gray-400'>
            <div className='flex justify-between border-b border-gray-800 py-2'>
              <span>Genre</span>
              <span className='text-white'>{movie.movieGenres.name}</span>
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

        {/* Right Column: Showtimes (Wireframe: Today/Tomorrow, Show time buttons) */}
        <div className='md:col-span-4 pl-0 md:pl-8'>
          {/*TODO: Implement ShowtimeSelector component*/}
          {/*<ShowtimeSelector screenings={movie.screenings} />*/}
        </div>
      </div>

      {/* Bottom Section: Recommendations */}
      <section>
        <h3 className='text-center text-xl font-semibold mb-8 text-gray-200'>Recommended movies</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {/*TODO: Implement recomendations*/}
          {/*{movie.recommendations.map((rec) => (*/}
          {/*  <div key={rec.id} className='group cursor-pointer'>*/}
          {/*    <div className='relative aspect-[2/3] bg-gray-900 border border-gray-700 rounded-lg overflow-hidden mb-2'>*/}
          {/*      <Image*/}
          {/*        src={rec.posterUrl || '/placeholder.png'}*/}
          {/*        alt={rec.title}*/}
          {/*        fill*/}
          {/*        className='object-cover transition-transform group-hover:scale-105'*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*    <p className='text-center text-sm font-medium'>{rec.title}</p>*/}
          {/*  </div>*/}
          {/*))}*/}
        </div>
      </section>
    </>
  );
}
