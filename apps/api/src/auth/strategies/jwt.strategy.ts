import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private UsersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request & { cookies: Record<string, any> }) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'devSecretKeyDoNotUseInProd',
    });
  }

  async validate(payload: { sub: number; email: string }): Promise<UserEntity> {
    const user: UserEntity = await this.UsersService.findOne(payload.email);

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return user;
  }
}
