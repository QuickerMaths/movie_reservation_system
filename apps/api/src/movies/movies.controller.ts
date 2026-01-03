import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
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

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // TODO: Add validation
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  // TODO: Implement pagination and filtering
  @Get()
  @ApiOkResponse({ type: [MovieGridItemEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  async getMovieGrid() {
    const movies = await this.moviesService.findAllMovieGridItems();

    return movies.map((m) => new MovieGridItemEntity(m));
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
  @ApiOkResponse({ type: [MovieGridItemEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  async getRecommendedMovies(@Param('id', ParseIntPipe) id: number) {
    const recommendedMovies = await this.moviesService.findRecommendedMovies(id);

    return recommendedMovies.map((m) => new MovieGridItemEntity(m));
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
