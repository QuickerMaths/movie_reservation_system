import {
  DefaultValuePipe,
  Controller,
  Get,
  Patch,
  Post,
  Body,
  ForbiddenException,
  Query,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  @Get('user/:userId')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ReservationEntity' },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 42 },
            totalPages: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Request() req: RequestWithUser,
  ): Promise<{
    data: ReservationEntity[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    if (req.user.user_id !== userId) {
      throw new ForbiddenException('You are not allowed to access these reservations');
    }

    const reservations = await this.reservationsService.findByUserId(userId, page, limit);

    return {
      data: reservations.data.map((reservation) => new ReservationEntity(reservation)),
      meta: reservations.meta,
    };
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

  @Patch(':id/cancel/me')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ReservationEntity })
  async cancelByIdAsAuthenticatedUser(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<ReservationEntity> {
    const reservation = await this.reservationsService.cancel(id, undefined, req.user.user_id);

    return new ReservationEntity(reservation);
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
