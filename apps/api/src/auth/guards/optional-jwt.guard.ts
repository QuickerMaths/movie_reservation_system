import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = UserEntity>(err: any, user: TUser): TUser | null {
    if (err || !user) {
      return null;
    }

    return user;
  }
}
