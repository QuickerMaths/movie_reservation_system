import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ShowsMovieDetailEntity } from './entities/shows-movie-detail.entity';
import { GetShowsDto } from './dto/get-shows-dto';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';

@Controller('shows')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  @Get(':movieId')
  @ApiOkResponse({ type: ShowsMovieDetailEntity })
  @ApiQuery({ name: 'date', required: false, type: String })
  @UseInterceptors(ClassSerializerInterceptor)
  async getShowDetailsById(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query() query: GetShowsDto,
  ) {
    const shows = await this.showsService.findShowsByMovieId(movieId, query);

    if (!shows) {
      throw new EntityNotFoundException('Shows for Movie', movieId);
    }

    return shows.map((s) => new ShowsMovieDetailEntity(s));
  }
}
