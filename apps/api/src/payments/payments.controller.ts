import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { ApiOkResponse } from '@nestjs/swagger';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(OptionalJwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: PaymentEntity })
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    const mockResult = await this.paymentsService.processMockPayment({ data: createPaymentDto });

    return new PaymentEntity({ status: mockResult });
  }
}
