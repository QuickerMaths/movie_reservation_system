import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegularUserDto } from './dto/create-regular-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from '../../generated/prisma/client';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserWithRoleEntityEntity } from './entities/user-with-role.entity';
import { TUserWithRoles } from '../../types/prisma/users-queries.types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateRegularUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
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
        regular_user_profiles: {
          create: {
            newsletter_opt_in: updateUserDto.newsletterOptIn,
            phone_number: updateUserDto.phoneNumber,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity(user);
  }

  async createRegularUser(createUserDto: CreateRegularUserDto): Promise<UserEntity> {
    const { email, password, firstName, lastName } = createUserDto;

    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const regularRole = await this.prisma.roles.findFirst({
      where: { name: 'REGULAR' },
    });

    if (!regularRole) {
      throw new InternalServerErrorException('Role "REGULAR" not found. Please seed the database.');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user: users = await this.prisma.users.create({
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        password_hash: passwordHash,
        users_roles: {
          create: {
            role_id: regularRole.role_id,
          },
        },
        regular_user_profiles: {
          create: {
            newsletter_opt_in: createUserDto.newsletterOptIn,
            phone_number: createUserDto.phoneNumber || null,
          },
        },
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
    const user: TUserWithRoles = await this.prisma.users.findUnique({
      where: { email },
      include: {
        users_roles: {
          include: {
            roles: {
              select: {
                name: true,
              },
            },
          },
        },
        regular_user_profiles: {
          select: {
            newsletter_opt_in: true,
            phone_number: true,
            preferred_genre_id: true,
          },
        },
      },
    });

    return new UserWithRoleEntityEntity(user);
  }
}
