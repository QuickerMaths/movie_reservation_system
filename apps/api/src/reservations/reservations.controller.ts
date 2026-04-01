import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
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
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ReservationDetailEntity> {
    const reservation = await this.reservationsService.findOne(id);

    if (!reservation) {
      throw new EntityNotFoundException('Reservation', id);
    }

    return new ReservationDetailEntity(reservation);
  }
}
