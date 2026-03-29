'use client';

import Image from 'next/image';
import { useMovieDetailsQuery } from '@/hooks/movies-query-hooks';
import { Star, Clock, Film } from 'lucide-react';

interface ReservationMoviePreviewProps {
  movieId: string;
}

export default function ReservationMoviePreview({ movieId }: ReservationMoviePreviewProps) {
  const { data: movie, isLoading } = useMovieDetailsQuery(movieId);

  if (isLoading || !movie) {
    return <div className='w-full aspect-video bg-gray-900 animate-pulse rounded-xl mb-6' />;
  }

  return (
    <div className='mb-8 group'>
      <div className='relative aspect-video w-full rounded-xl overflow-hidden mb-4 shadow-2xl'>
        <Image
          src={movie.posterImageUrl || '/image_placeholder.png'}
          alt={movie.title}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent' />
        <div className='absolute bottom-3 left-3'>
          <span className='bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider'>
            Now Booking
          </span>
        </div>
      </div>

      <div className='space-y-2'>
        <h1 className='text-2xl font-bold text-white tracking-tight leading-none'>{movie.title}</h1>

        <div className='flex items-center gap-4 text-sm text-gray-400'>
          <div className='flex items-center gap-1.5'>
            <Film className='w-4 h-4 text-red-500' />
            <span>{movie.genre}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Clock className='w-4 h-4 text-red-500' />
            <span>{movie.durationMinutes} min</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Star className='w-4 h-4 text-yellow-500 fill-yellow-500' />
            <span className='font-bold text-white'>
              {movie.cachedRating ? Number(movie.cachedRating).toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className='mt-4 border-t border-gray-800 pt-4'>
        <p className='text-gray-400 text-sm line-clamp-2 leading-relaxed'>{movie.description}</p>
      </div>
    </div>
  );
}
