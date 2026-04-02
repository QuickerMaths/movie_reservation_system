import { ApiProperty } from '@nestjs/swagger';
import { TUserWithRoles } from '../../../types/prisma/users-queries.types';

export class UserWithRoleEntityEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'regular' })
  role: string;

  @ApiProperty({ example: '+1234567890' })
  phoneNumber: string | null;

  @ApiProperty({ example: true })
  newsletterOptIn: boolean | null;

  // TODO: change to genre object later
  @ApiProperty({ example: 1 })
  preferredGenreId: number | null;

  @ApiProperty()
  createdAt: Date | null;

  constructor(source: TUserWithRoles) {
    this.id = source.user_id;
    this.email = source.email;
    this.firstName = source.first_name;
    this.lastName = source.last_name;
    this.role = source.users_roles?.[0]?.roles?.name ?? '';
    this.phoneNumber = source.regular_user_profiles?.phone_number ?? null;
    this.newsletterOptIn = source.regular_user_profiles?.newsletter_opt_in ?? null;
    this.preferredGenreId = source.regular_user_profiles?.preferred_genre_id ?? null;
    this.createdAt = source.created_at ?? null;
  }
}
