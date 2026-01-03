import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';
import { movies, Prisma } from '../../generated/prisma/client';
import { movieGridSelect, MovieGridItem } from './movies.selectors';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  private get activeMovieFilter(): Prisma.moviesWhereInput {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return {
      last_show_date: { gt: startOfToday },
    };
  }

  // TODO: Implement pagination
  // TODO: Implement filtering by genre, rating, etc.

  async findAllMovieGridItems(): Promise<MovieGridItem[]> {
    return this.prisma.movies.findMany({
      where: this.activeMovieFilter,
      select: movieGridSelect,
    });
  }

  // TODO: This does not have the activeMovieFilter applied, create a fronted component to handle inactive movies

  async findMovieDetailsById(id: number): Promise<movies> {
    return this.prisma.movies.findUnique({
      where: { movie_id: id },
      include: {
        movie_genres: true,
      },
    });
  }

  async findRecommendedMovies(id: number): Promise<MovieGridItem[]> {
    return this.prisma.movies.findMany({
      where: {
        is_recommended: true,
        NOT: { movie_id: id },
        ...this.activeMovieFilter,
      },
      select: movieGridSelect,
    });
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
