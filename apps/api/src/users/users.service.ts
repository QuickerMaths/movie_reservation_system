import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegularUserDto } from './dto/create-regular-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users, roles } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { TUserWithRoles } from '../../types/prisma/users-queries.types';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateRegularUser(id: number, updateUserDto: UpdateUserDto): Promise<users> {
    const { password, ...data } = updateUserDto;

    let passwordHash: string | undefined;
    if (password) {
      const salt = await bcrypt.genSalt();
      passwordHash = await bcrypt.hash(password, salt);
    }

    const user: users = await this.prisma.users.update({
      where: { user_id: id },
      data: {
        ...data,
        ...(passwordHash && { password_hash: passwordHash }),
        regular_user_profiles: {
          upsert: {
            where: { user_id: id },
            create: {
              newsletter_opt_in: updateUserDto.newsletterOptIn,
              phone_number: updateUserDto.phoneNumber,
            },
            update: {
              newsletter_opt_in: updateUserDto.newsletterOptIn,
              phone_number: updateUserDto.phoneNumber,
            },
          },
        },
      },
    });

    return user;
  }

  async createRegularUser(createUserDto: CreateRegularUserDto): Promise<users> {
    const { email, password, firstName, lastName } = createUserDto;

    const regularRole: roles = await this.prisma.roles
      .findFirst({
        where: { name: 'REGULAR' },
      })
      .catch(() => {
        throw new InternalServerErrorException('System role "REGULAR" not found.');
      });

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

    return user;
  }

  async findOne(email: string): Promise<users> {
    const user: users = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<TUserWithRoles> {
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

    if (!user) {
      throw new EntityNotFoundException('User', email);
    }

    return user;
  }
}
