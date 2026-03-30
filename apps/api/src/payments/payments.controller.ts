import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: PaymentEntity })
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    const mockResult = await this.paymentsService.processMockPayment({ data: createPaymentDto });

    return new PaymentEntity({ status: mockResult });
  }
}
