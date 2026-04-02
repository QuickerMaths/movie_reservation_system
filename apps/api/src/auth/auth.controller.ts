import {
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Body,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request as ExpressRequest } from 'express';
import { CreateRegularUserDto } from '../users/dto/create-regular-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

interface RequestWithUser extends ExpressRequest {
  user: UserEntity;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOkResponse({ type: UserEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  login(
    @Request() req: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ): UserEntity {
    const { access_token } = this.authService.login(req.user);

    response.cookie('Authentication', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return req.user;
  }

  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: UserEntity })
  async register(@Body() createUserDto: CreateRegularUserDto): Promise<UserEntity> {
    const user = await this.authService.register(createUserDto);

    return new UserEntity(user);
  }

  @Post('logout')
  @ApiOkResponse({ type: Object })
  logout(@Res({ passthrough: true }) response: Response): { message: string } {
    response.clearCookie('Authentication');
    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: UserEntity })
  getProfile(@Request() req: RequestWithUser): UserEntity {
    return req.user;
  }
}
