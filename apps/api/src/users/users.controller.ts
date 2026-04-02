import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from '../../generated/prisma/client';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserWithRoleEntityEntity } from './entities/user-with-role.entity';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

interface RequestWithUser extends ExpressRequest {
  user: users;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  @ApiOkResponse({ type: UserWithRoleEntityEntity })
  async getProfile(@Request() req: RequestWithUser): Promise<UserWithRoleEntityEntity> {
    const user = await this.usersService.findByEmail(req.user.email);

    return new UserWithRoleEntityEntity(user);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('profile')
  @ApiOkResponse({ type: UserEntity })
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.usersService.updateRegularUser(req.user.user_id, updateUserDto);

    return new UserEntity(user);
  }
}
