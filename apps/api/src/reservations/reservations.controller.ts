import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { Request as ExpressRequest } from 'express';
import { users } from '../../generated/prisma/client';
import { ReservationEntity } from './entities/reservation.entity';
import { ApiOkResponse } from '@nestjs/swagger';
import { ReservationDetailEntity } from './entities/reservation-paid.entity';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';

interface RequestWithUser extends ExpressRequest {
  user: users;
}

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(OptionalJwtGuard)
  @ApiOkResponse({ type: ReservationEntity })
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req: RequestWithUser,
  ): Promise<ReservationEntity> {
    const userId = req.user?.user_id;

    const reservation = await this.reservationsService.create(createReservationDto, userId);

    return new ReservationEntity(reservation);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: ReservationDetailEntity })
  async findOneById(@Param('id', ParseIntPipe) id: number): Promise<ReservationDetailEntity> {
    const reservation = await this.reservationsService.findOne(id);

    if (!reservation) {
      throw new EntityNotFoundException('Reservation', id);
    }

    return new ReservationDetailEntity(reservation);
  }

  @Get('cancel/:token')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: ReservationDetailEntity })
  async findOneByCancellationToken(
    @Param('token') token: string,
  ): Promise<ReservationDetailEntity> {
    const reservation = await this.reservationsService.findOneByCancellationToken(token);

    if (!reservation) {
      throw new EntityNotFoundException('Reservation for provided cancellation token', token);
    }

    return new ReservationDetailEntity(reservation);
  }

  @Patch(':id/cancel')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(OptionalJwtGuard)
  @ApiOkResponse({ type: ReservationEntity })
  async cancelById(
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelReservationDto: CancelReservationDto,
    @Request() req: RequestWithUser,
  ): Promise<ReservationEntity> {
    const userId = req.user?.user_id;
    const reservation = await this.reservationsService.cancel(
      id,
      cancelReservationDto.cancellation_token,
      userId,
    );

    return new ReservationEntity(reservation);
  }

  @Patch('cancel/:token')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: ReservationEntity })
  async cancelByToken(@Param('token') token: string): Promise<ReservationEntity> {
    const reservation = await this.reservationsService.cancelByToken(token);

    return new ReservationEntity(reservation);
  }
}
