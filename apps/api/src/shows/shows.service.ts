import { Injectable } from '@nestjs/common';
import { shows } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetShowsDto } from './dto/get-shows-dto';
import { NotFoundException } from '@nestjs/common';
import { ReservationStatus } from '../../generated/prisma/client';
import { SeatWithRelations } from './entities/seat-with-status.entity';

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

  async getShowSeats(showId: number): Promise<SeatWithRelations[]> {
    const TEN_MINUTES_AGO = new Date(Date.now() - 10 * 60 * 1000);

    const show = await this.prisma.shows.findUnique({
      where: { show_id: showId },
      select: { movie_room_id: true },
    });

    if (!show) throw new NotFoundException('Show not found');

    return this.prisma.seats.findMany({
      where: { movie_room_id: show.movie_room_id },
      include: {
        seat_types: true,
        tickets: {
          where: {
            show_id: showId,
            reservations: {
              OR: [
                { status: ReservationStatus.PAID },
                {
                  status: ReservationStatus.PENDING,
                  reservation_date: { gte: TEN_MINUTES_AGO },
                },
              ],
            },
          },
          include: {
            reservations: { select: { status: true } },
          },
        },
      },
      orderBy: [{ row_label: 'asc' }, { seat_number: 'asc' }],
    });
  }
}
