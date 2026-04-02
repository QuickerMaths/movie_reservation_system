import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';
import { movies, Prisma } from '../../generated/prisma/client';
import { movieGridSelect, MovieGridItem } from './movies.selectors';
import { PaginatedResult } from '../../types/types';
import {
  GetRecommendedMoviesDto,
  RecommendedMovieSortField,
} from './dto/get-recommended-movies.dto';
import { GetMoviesDto, MovieSortField } from './dto/get-movies.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly DEFAULT_PAGE = 1;
  private readonly DEFAULT_LIMIT = 12;
  private readonly MAX_LIMIT = 100;

  private get activeMovieFilter(): Prisma.moviesWhereInput {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return {
      last_show_date: { gt: startOfToday },
    };
  }

  private getPagination(page?: number, limit?: number) {
    const safePage = Math.max(page ?? this.DEFAULT_PAGE, 1);
    const safeLimit = Math.min(Math.max(limit ?? this.DEFAULT_LIMIT, 1), this.MAX_LIMIT);
    return {
      safePage,
      safeLimit,
      skip: (safePage - 1) * safeLimit,
    };
  }

  private mapMovieSort(
    sortBy?: MovieSortField | RecommendedMovieSortField,
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Prisma.moviesOrderByWithRelationInput {
    const sortMap: Record<
      MovieSortField | RecommendedMovieSortField,
      keyof Prisma.moviesOrderByWithRelationInput
    > = {
      title: 'title',
      cachedRating: 'cached_rating',
      durationMinutes: 'duration_minutes',
      lastShowDate: 'last_show_date',
    };

    const prismaField = sortBy ? sortMap[sortBy] : 'title';
    return { [prismaField]: sortOrder };
  }

  private buildMoviesWhere(query: GetMoviesDto): Prisma.moviesWhereInput {
    return {
      ...this.activeMovieFilter,
      ...(query.genreId ? { genre_id: query.genreId } : {}),
      ...(query.q
        ? {
            title: {
              contains: query.q,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(typeof query.minRating === 'number' ? { cached_rating: { gte: query.minRating } } : {}),
      ...(typeof query.isRecommended === 'boolean' ? { is_recommended: query.isRecommended } : {}),
    };
  }

  private buildRecommendedWhere(
    movieId: number,
    query: GetRecommendedMoviesDto,
  ): Prisma.moviesWhereInput {
    return {
      ...this.activeMovieFilter,
      is_recommended: true,
      NOT: { movie_id: movieId },
      ...(query.genreId ? { genre_id: query.genreId } : {}),
      ...(typeof query.minRating === 'number' ? { cached_rating: { gte: query.minRating } } : {}),
    };
  }

  async findAllMovieGridItems(query: GetMoviesDto): Promise<PaginatedResult<MovieGridItem>> {
    const { safePage, safeLimit, skip } = this.getPagination(query.page, query.limit);
    const where = this.buildMoviesWhere(query);
    const orderBy = this.mapMovieSort(query.sortBy, query.sortOrder ?? 'asc');

    const [data, total] = await this.prisma.$transaction([
      this.prisma.movies.findMany({
        where,
        orderBy,
        skip,
        take: safeLimit,
        select: movieGridSelect,
      }),
      this.prisma.movies.count({ where }),
    ]);

    return {
      data,
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.max(Math.ceil(total / safeLimit), 1),
      },
    };
  }

  async findMovieDetailsById(id: number): Promise<movies> {
    return this.prisma.movies.findUnique({
      where: { movie_id: id },
      include: {
        movie_genres: true,
      },
    });
  }

  async findRecommendedMovies(
    id: number,
    query: GetRecommendedMoviesDto,
  ): Promise<PaginatedResult<MovieGridItem>> {
    const { safePage, safeLimit, skip } = this.getPagination(query.page, query.limit);
    const where = this.buildRecommendedWhere(id, query);
    const orderBy = this.mapMovieSort(query.sortBy, query.sortOrder ?? 'desc');

    const [data, total] = await this.prisma.$transaction([
      this.prisma.movies.findMany({
        where,
        orderBy,
        skip,
        take: safeLimit,
        select: movieGridSelect,
      }),
      this.prisma.movies.count({ where }),
    ]);

    return {
      data,
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.max(Math.ceil(total / safeLimit), 1),
      },
    };
  }

  async create(createMovieDto: CreateMovieDto): Promise<movies> {
    const data: Prisma.moviesCreateInput = {
      title: createMovieDto.title,
      description: createMovieDto.description,
      poster_image_url: createMovieDto.posterImageUrl,
      duration_minutes: createMovieDto.durationMinutes,
      last_show_date: createMovieDto.lastShowDate,
      is_recommended: createMovieDto.isRecommended,
      movie_genres: { connect: { genre_id: createMovieDto.genreId } },
    };

    return this.prisma.movies.create({ data });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<movies> {
    const data: Prisma.moviesUpdateInput = {
      title: updateMovieDto.title,
      description: updateMovieDto.description,
      poster_image_url: updateMovieDto.posterImageUrl,
      duration_minutes: updateMovieDto.durationMinutes,
      last_show_date: updateMovieDto.lastShowDate,
      is_recommended: updateMovieDto.isRecommended,
      movie_genres: { connect: { genre_id: updateMovieDto.genreId } },
    };

    return this.prisma.movies.update({
      where: { movie_id: id },
      data,
    });
  }

  async remove(id: number): Promise<movies> {
    return this.prisma.movies.delete({
      where: { movie_id: id },
    });
  }
}
