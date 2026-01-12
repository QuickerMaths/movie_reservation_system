import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from '../../generated/prisma/client';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserWithRoleEntityEntity } from './entities/user-with-role.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const { password, ...data } = updateUserDto;

    let passwordHash: string | undefined;
    if (password) {
      const salt = await bcrypt.genSalt();
      passwordHash = await bcrypt.hash(password, salt);
    }

    const user = await this.prisma.users.update({
      where: { user_id: id },
      data: {
        ...data,
        ...(passwordHash && { password_hash: passwordHash }),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity(user);
  }

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

  async findByEmail(email: string): Promise<UserWithRoleEntityEntity> {
    const user = await this.prisma.users.findUnique({
      where: { email },
      include: {
        users_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    return new UserWithRoleEntityEntity(user);
  }
}
