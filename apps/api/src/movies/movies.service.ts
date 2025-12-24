import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma.service';

const prisma = new PrismaService();

@Injectable()
export class MoviesService {
  async create(createMovieDto: CreateMovieDto) {
    return prisma.movies.create({
      data: {
        movie_id: createMovieDto.movieId,
        title: createMovieDto.title,
        description: createMovieDto.description,
        poster_image_url: createMovieDto.posterImageUrl,
        cached_rating: createMovieDto.cachedRating,
        duration_minutes: createMovieDto.durationMinutes,
        last_show_date: createMovieDto.lastShowDate,
        is_recommended: createMovieDto.isRecommended,
        genre_id: createMovieDto.genreId,
      },
    });
  }

  // TODO: Implement pagination
  // TODO: Implement filtering by genre, rating, etc.

  async findAll() {
    return prisma.movies.findMany({
      include: {
        movie_genres: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return prisma.movies.findUnique({
      where: { movie_id: id },
      include: {
        movie_genres: true,
      },
    });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    return prisma.movies.update({
      where: { movie_id: id },
      data: {
        title: updateMovieDto.title,
        description: updateMovieDto.description,
        poster_image_url: updateMovieDto.posterImageUrl,
        cached_rating: updateMovieDto.cachedRating,
        duration_minutes: updateMovieDto.durationMinutes,
        last_show_date: updateMovieDto.lastShowDate,
        is_recommended: updateMovieDto.isRecommended,
        genre_id: updateMovieDto.genreId,
      },
    });
  }

  async remove(id: number) {
    return prisma.movies.delete({
      where: { movie_id: id },
    });
  }
}
