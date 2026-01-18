import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateRegularUserDto } from '../users/dto/create-regular-user.dto';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserEntity> {
    try {
      const user: UserEntity = await this.usersService.findOne(email);
      const isMatch = await bcrypt.compare(pass, user.password_hash);

      if (isMatch) {
        return user;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }

      throw error;
    }
  }

  login(user: UserEntity): { access_token: string } {
    const payload = { email: user.email, sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateRegularUserDto): Promise<UserEntity> {
    return this.usersService.createRegularUser(createUserDto);
  }
}
