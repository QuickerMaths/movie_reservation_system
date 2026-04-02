import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservationStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationsCleanupService {
  private readonly logger = new Logger(ReservationsCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async cleanupExpiredPendingReservations(): Promise<void> {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const expiredReservations = await this.prisma.reservations.findMany({
      where: {
        status: ReservationStatus.PENDING,
        reservation_date: { lt: tenMinutesAgo },
      },
      include: {
        tickets: {
          include: {
            seats: {
              include: { seat_types: true },
            },
          },
        },
      },
    });

    for (const reservation of expiredReservations) {
      const snapshot =
        reservation.seats_snapshot ??
        reservation.tickets.map((ticket) => ({
          seat_id: ticket.seat_id ?? 0,
          row: ticket.seats?.row_label ?? '',
          number: ticket.seats?.seat_number ?? 0,
          type: ticket.seats?.seat_types?.name ?? '',
          price: Number(ticket.sold_price),
        }));

      await this.prisma.$transaction([
        this.prisma.reservations.update({
          where: { reservation_id: reservation.reservation_id },
          data: {
            status: ReservationStatus.CANCELLED,
            seats_snapshot: snapshot,
          },
        }),
        this.prisma.tickets.deleteMany({
          where: { reservation_id: reservation.reservation_id },
        }),
      ]);
    }

    if (expiredReservations.length > 0) {
      this.logger.log(`Auto-cancelled ${expiredReservations.length} expired reservations`);
    }
  }
}
