import { Injectable } from '@nestjs/common';
import { shows } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetShowsDto } from './dto/get-shows-dto';

@Injectable()
export class ShowsService {
  constructor(private readonly prisma: PrismaService) {}

  async findShowsByMovieId(movieId: number, getShowsDto: GetShowsDto): Promise<shows[]> {
    const { date } = getShowsDto;
    const targetDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setDate(endOfDay.getDate() + 1);
    endOfDay.setHours(0, 0, 0, 0);

    return await this.prisma.shows.findMany({
      where: {
        movie_id: movieId,
        start_timestamp: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: {
        start_timestamp: 'asc',
      },
    });
  }
}
