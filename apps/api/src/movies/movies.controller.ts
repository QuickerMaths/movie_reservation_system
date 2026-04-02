import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { MovieGridItemEntity } from './entities/movie-grid-item.entity';
import { MovieDetailEntity } from './entities/movie-detail.entity';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';
import { GetMoviesDto } from './dto/get-movies.dto';
import { GetRecommendedMoviesDto } from './dto/get-recommended-movies.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // TODO: Add validation
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOkResponse({
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/MovieGridItemEntity' },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 12 },
            total: { type: 'number', example: 42 },
            totalPages: { type: 'number', example: 4 },
          },
        },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getMovieGrid(@Query() query: GetMoviesDto) {
    const movies = await this.moviesService.findAllMovieGridItems(query);

    return {
      data: movies.data.map((m) => new MovieGridItemEntity(m)),
      meta: movies.meta,
    };
  }

  @Get(':id')
  @ApiOkResponse({ type: MovieDetailEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  async getMovieDetailsById(@Param('id', ParseIntPipe) id: number) {
    const movieDetails = await this.moviesService.findMovieDetailsById(id);

    if (!movieDetails) {
      throw new EntityNotFoundException('Movie', id);
    }

    return new MovieDetailEntity(movieDetails);
  }

  @Get(':id/recommended')
  @ApiOkResponse({
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/MovieGridItemEntity' },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 8 },
            total: { type: 'number', example: 12 },
            totalPages: { type: 'number', example: 2 },
          },
        },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getRecommendedMovies(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetRecommendedMoviesDto,
  ) {
    const recommendedMovies = await this.moviesService.findRecommendedMovies(id, query);

    return {
      data: recommendedMovies.data.map((m) => new MovieGridItemEntity(m)),
      meta: recommendedMovies.meta,
    };
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }
}
