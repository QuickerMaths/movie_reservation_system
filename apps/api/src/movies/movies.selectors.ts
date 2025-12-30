import { Prisma } from '../../generated/prisma/client';

export const movieGridSelect = {
  movie_id: true,
  title: true,
  poster_image_url: true,
  cached_rating: true,
  duration_minutes: true,
  movie_genres: {
    select: {
      name: true,
    },
  },
} satisfies Prisma.moviesSelect;

export type MovieGridItem = Prisma.moviesGetPayload<{ select: typeof movieGridSelect }>;
