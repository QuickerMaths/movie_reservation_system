import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus } from '../../generated/prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async processMockPayment({ data }: { data: CreatePaymentDto }): Promise<ReservationStatus> {
    const reservation = await this.prisma.reservations.findUnique({
      where: { reservation_id: data.reservation_id },
      select: {
        reservation_id: true,
        status: true,
        reservation_date: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new ConflictException('Only PENDING reservations can be processed for payment');
    }

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (reservation.reservation_date && reservation.reservation_date < tenMinutesAgo) {
      throw new ConflictException('This reservation has expired and cannot be paid anymore');
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const updateResult = await this.prisma.reservations.updateMany({
      where: {
        reservation_id: data.reservation_id,
        status: ReservationStatus.PENDING,
      },
      data: {
        status: data.result,
      },
    });

    if (updateResult.count === 0) {
      throw new ConflictException('Reservation status changed. Refresh and try again');
    }

    return data.result;
  }
}
