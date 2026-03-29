import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationStatus } from '../../generated/prisma/client';
import { reservations } from '../../generated/prisma/client';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReservationDto, userId?: number): Promise<reservations> {
    const { show_id, seat_ids, guest_email } = dto;
    const TEN_MINUTES_AGO = new Date(Date.now() - 10 * 60 * 1000);

    return this.prisma.$transaction(async (tx) => {
      const conflictingTickets = await tx.tickets.findMany({
        where: {
          show_id,
          seat_id: { in: seat_ids },
          reservations: {
            OR: [
              { status: ReservationStatus.PAID },
              {
                status: ReservationStatus.PENDING,
                reservation_date: { lte: TEN_MINUTES_AGO },
              },
            ],
          },
        },
      });

      if (conflictingTickets.length > 0) {
        throw new ConflictException('One or more selected seats are already reserved or held.');
      }

      const reservation = await tx.reservations.create({
        data: {
          reservation_date: new Date(Date.now()),
          status: ReservationStatus.PENDING,
          show_id,
          user_id: userId || null,
          guest_emial: guest_email || null,
        },
      });

      const seatsWithPrices = await tx.seats.findMany({
        where: {
          seat_id: { in: seat_ids },
        },
        include: {
          seat_types: true,
        },
      });

      await tx.tickets.createMany({
        data: seatsWithPrices.map((seat) => ({
          reservation_id: reservation.reservation_id,
          show_id,
          seat_id: seat.seat_id,
          sold_price: Number(seat.seat_types.default_price),
        })),
      });

      return reservation;
    });
  }
}
