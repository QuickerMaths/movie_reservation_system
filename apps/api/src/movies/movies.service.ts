import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    return this.prisma.movies.create({
      data: {
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
    return this.prisma.movies.findMany({
      include: {
        movie_genres: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.movies.findUnique({
      where: { movie_id: id },
      include: {
        movie_genres: true,
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
        cached_rating: updateMovieDto.cachedRating,
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
