import Link from 'next/link';
import Image from 'next/image';
import { IMovieGirdItem } from '@/types/movie';
import { cn } from '@/lib/utils';

type ComponentSize = 'sm' | 'md' | 'lg';

interface MoviePreviewProps {
  movie: IMovieGirdItem;
  size?: ComponentSize;
  className?: string;
}

const sizeConfig: Record<
  ComponentSize,
  {
    width: string;
    padding: string;
    titleSize: string;
    metaSize: string;
    badgeSize: string;
    gap: string;
  }
> = {
  sm: {
    width: 'w-40',
    padding: 'p-2',
    titleSize: 'text-sm',
    metaSize: 'text-[10px]',
    badgeSize: 'text-[10px] px-1.5 py-0.5',
    gap: 'mb-1',
  },
  md: {
    width: 'w-64',
    padding: 'p-4',
    titleSize: 'text-lg',
    metaSize: 'text-xs',
    badgeSize: 'text-xs px-2 py-1',
    gap: 'mb-2',
  },
  lg: {
    width: 'w-80',
    padding: 'p-6',
    titleSize: 'text-2xl',
    metaSize: 'text-base',
    badgeSize: 'text-sm px-3 py-1.5',
    gap: 'mb-1',
  },
};

export default function MoviePreview({ movie, size = 'md', className }: MoviePreviewProps) {
  const styles = sizeConfig[size];

  return (
    <Link
      href={`/movies/${movie.id}`}
      className={cn('block no-underline shrink-0', styles.width, className)}
    >
      <article className='group bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-xl flex flex-col h-full'>
        <div className='relative aspect-[2/3] w-full bg-gray-800'>
          <Image
            src={movie.posterImageUrl || '/image_placeholder.png'}
            alt={movie.title}
            fill
            className='object-cover group-hover:opacity-80 transition-opacity'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>

        <div className={`${styles.padding} flex flex-col flex-grow`}>
          <div className={`flex justify-between items-start ${styles.gap}`}>
            <h3 className={`${styles.titleSize} font-bold truncate pr-2 text-white`}>
              {movie.title}
            </h3>
            <span
              className={`bg-gray-800 text-gray-300 rounded whitespace-nowrap ${styles.badgeSize}`}
            >
              {movie.durationMinutes != null ? `${movie.durationMinutes} min` : 'N/A'}
            </span>
          </div>

          <div className='flex justify-between items-center mt-auto'>
            <span className={`${styles.metaSize} text-red-500 font-medium`}>
              {movie.movieGenres?.name || 'Genre'}
            </span>
            {/* TODO: Add the rating stars */}
            <span className={`${styles.metaSize} text-yellow-500 font-bold`}>
              {movie.cachedRating != null ? Number(movie.cachedRating).toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
