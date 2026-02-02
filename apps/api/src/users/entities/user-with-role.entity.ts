import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TUserWithRoles } from '../../../types/prisma/users-queries.types';

export class UserWithRoleEntityEntity {
  @Expose({ name: 'id' })
  @ApiProperty({ example: 1 })
  user_id: number;

  @Expose()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @Expose({ name: 'firstName' })
  @ApiProperty({ example: 'John' })
  first_name: string;

  @Expose({ name: 'lastName' })
  @ApiProperty({ example: 'Doe' })
  last_name: string;

  @Expose({ name: 'role' })
  @Transform(({ obj }: { obj: TUserWithRoles }) => {
    if (!obj.users_roles || obj.users_roles.length === 0) return null;

    return obj.users_roles[0].roles.name;
  })
  @ApiProperty({ example: 'regular' })
  role: string;

  @Expose({ name: 'phoneNumber' })
  @Transform(({ obj }: { obj: TUserWithRoles }) => {
    if (!obj.regular_user_profiles) return null;

    return obj.regular_user_profiles.phone_number;
  })
  @ApiProperty({ example: '+1234567890' })
  phone_number: string | null;

  @Expose({ name: 'newsletterOptIn' })
  @Transform(({ obj }: { obj: TUserWithRoles }) => {
    if (!obj.regular_user_profiles) return null;

    return obj.regular_user_profiles.newsletter_opt_in;
  })
  @ApiProperty({ example: true })
  newsletter_opt_in: boolean | null;

  // TODO: change to genre object later
  @Expose({ name: 'preferredGenreId' })
  @Transform(({ obj }: { obj: TUserWithRoles }) => {
    if (!obj.regular_user_profiles) return null;

    return obj.regular_user_profiles.preferred_genre_id;
  })
  @ApiProperty({ example: 1 })
  preferred_genre_id: number | null;

  @Exclude()
  password_hash: string;

  @Exclude()
  regular_user_profiles: object;

  @Exclude()
  users_roles: object;

  @Expose({ name: 'createdAt' })
  @ApiProperty()
  created_at: Date | null;

  constructor(partial: Partial<UserWithRoleEntityEntity>) {
    Object.assign(this, partial);
  }
}
