import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: Implement pagination
  // TODO: Implement filtering by genre, rating, etc.

  async findAllMovieGridItems() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return this.prisma.movies.findMany({
      where: {
        last_show_date: { gt: startOfToday },
      },
      select: {
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
      },
    });
  }

  async findMovieDetailsById(id: number) {
    return this.prisma.movies.findUnique({
      where: { movie_id: id },
      include: {
        movie_genres: true,
      },
    });
  }

  async findRecommendedMovies(id: number) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return this.prisma.movies.findMany({
      where: {
        is_recommended: true,
        NOT: { movie_id: id },
        last_show_date: { gt: startOfToday },
      },
      select: {
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
      },
    });
  }

  async create(createMovieDto: CreateMovieDto) {
    return this.prisma.movies.create({
      data: {
        title: createMovieDto.title,
        description: createMovieDto.description,
        poster_image_url: createMovieDto.posterImageUrl,
        duration_minutes: createMovieDto.durationMinutes,
        last_show_date: createMovieDto.lastShowDate,
        is_recommended: createMovieDto.isRecommended,
        genre_id: createMovieDto.genreId,
      },
    });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    return this.prisma.movies.update({
      where: { movie_id: id },
      data: {
        title: updateMovieDto.title,
        description: updateMovieDto.description,
        poster_image_url: updateMovieDto.posterImageUrl,
        duration_minutes: updateMovieDto.durationMinutes,
        last_show_date: updateMovieDto.lastShowDate,
        is_recommended: updateMovieDto.isRecommended,
        genre_id: updateMovieDto.genreId,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.movies.delete({
      where: { movie_id: id },
    });
  }
}
