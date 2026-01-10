import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { users } from '../../generated/prisma/client';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password, firstName, lastName } = createUserDto;

    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user: users = await this.prisma.users.create({
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        password_hash: passwordHash,
      },
    });

    return new UserEntity(user);
  }

  async findOne(email: string): Promise<users> {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }
}
