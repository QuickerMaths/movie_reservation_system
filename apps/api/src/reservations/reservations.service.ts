import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationStatus } from '../../generated/prisma/client';
import { reservations } from '../../generated/prisma/client';
import { ReservationWithRelations } from './entities/reservation-paid.entity';

export type SeatSnapshotItem = {
  seat_id: number;
  row: string;
  number: number;
  type: string;
  price: number;
};

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  private assertCancellationWindow(showStartTimestamp?: Date | null): void {
    if (!showStartTimestamp) {
      return;
    }

    const latestCancellationTime = new Date(showStartTimestamp.getTime() - 24 * 60 * 60 * 1000);

    if (new Date() > latestCancellationTime) {
      throw new ConflictException(
        'Reservation can be cancelled only at least 24 hours before the show starts',
      );
    }
  }

  private mapSeatsToSnapshot(
    seats: Array<{
      seat_id: number;
      row_label: string;
      seat_number: number;
      seat_types: { name: string; default_price: unknown } | null;
    }>,
  ): SeatSnapshotItem[] {
    return seats.map((seat) => ({
      seat_id: seat.seat_id,
      row: seat.row_label,
      number: seat.seat_number,
      type: seat.seat_types?.name ?? '',
      price: Number(seat.seat_types?.default_price ?? 0),
    }));
  }

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
                reservation_date: { gte: TEN_MINUTES_AGO },
              },
            ],
          },
        },
      });

      if (conflictingTickets.length > 0) {
        throw new ConflictException('One or more selected seats are already reserved or held.');
      }

      const seatsWithPrices = await tx.seats.findMany({
        where: {
          seat_id: { in: seat_ids },
        },
        include: {
          seat_types: true,
        },
      });

      const seatsSnapshot = this.mapSeatsToSnapshot(seatsWithPrices);

      const reservation = await tx.reservations.create({
        data: {
          reservation_date: new Date(Date.now()),
          status: ReservationStatus.PENDING,
          show_id,
          user_id: userId || null,
          guest_emial: guest_email || null,
          seats_snapshot: seatsSnapshot,
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

  async findOne(id: number): Promise<ReservationWithRelations> {
    return this.prisma.reservations.findUnique({
      where: { reservation_id: id },
      include: {
        users: true,
        shows: {
          include: {
            movies: true,
            movie_rooms: true,
          },
        },
        tickets: {
          include: {
            seats: {
              include: {
                seat_types: true,
              },
            },
          },
        },
      },
    });
  }

  async findOneByCancellationToken(token: string): Promise<ReservationWithRelations | null> {
    return this.prisma.reservations.findUnique({
      where: { cancellation_token: token },
      include: {
        users: true,
        shows: {
          include: {
            movies: true,
            movie_rooms: true,
          },
        },
        tickets: {
          include: {
            seats: {
              include: {
                seat_types: true,
              },
            },
          },
        },
      },
    });
  }

  async findByUserId(
    userId: number,
    page = 1,
    limit = 10,
  ): Promise<{
    data: reservations[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.reservations.findMany({
        where: { user_id: userId },
        orderBy: { reservation_date: 'desc' },
        skip,
        take: safeLimit,
      }),
      this.prisma.reservations.count({
        where: { user_id: userId },
      }),
    ]);

    const totalPages = Math.max(Math.ceil(total / safeLimit), 1);

    return {
      data,
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
      },
    };
  }

  async cancel(id: number, cancellationToken?: string, userId?: number): Promise<reservations> {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservations.findUnique({
        where: { reservation_id: id },
        include: {
          shows: true,
          tickets: {
            include: {
              seats: {
                include: { seat_types: true },
              },
            },
          },
        },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (
        reservation.status !== ReservationStatus.PENDING &&
        reservation.status !== ReservationStatus.PAID
      ) {
        throw new ConflictException('Only PENDING or PAID reservations can be cancelled');
      }

      this.assertCancellationWindow(reservation.shows?.start_timestamp);

      const isOwner = Boolean(userId && reservation.user_id === userId);
      const hasValidToken =
        Boolean(cancellationToken) && reservation.cancellation_token === cancellationToken;

      if (!isOwner && !hasValidToken) {
        throw new ForbiddenException('You are not allowed to cancel this reservation');
      }

      const snapshot =
        reservation.seats_snapshot ??
        reservation.tickets.map((ticket) => ({
          seat_id: ticket.seat_id ?? 0,
          row: ticket.seats?.row_label ?? '',
          number: ticket.seats?.seat_number ?? 0,
          type: ticket.seats?.seat_types?.name ?? '',
          price: Number(ticket.sold_price),
        }));

      await tx.reservations.update({
        where: { reservation_id: id },
        data: {
          status: ReservationStatus.CANCELLED,
          seats_snapshot: snapshot,
        },
      });

      await tx.tickets.deleteMany({
        where: { reservation_id: id },
      });

      return tx.reservations.findUniqueOrThrow({
        where: { reservation_id: id },
      });
    });
  }

  async cancelByToken(token: string): Promise<reservations> {
    const reservation = await this.prisma.reservations.findUnique({
      where: { cancellation_token: token },
      select: { reservation_id: true },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return this.cancel(reservation.reservation_id, token);
  }
}
