import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus } from '../../generated/prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async processMockPayment({ data }: { data: CreatePaymentDto }): Promise<ReservationStatus> {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await this.prisma.reservations.update({
      where: { reservation_id: data.reservation_id },
      data: {
        status: data.result,
      },
    });

    return data.result;
  }
}
