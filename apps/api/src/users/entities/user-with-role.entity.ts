import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'regular' })
  @Expose({ name: 'email' })
  role: string;

  @ApiProperty({ example: '+1234567890' })
  @Expose({ name: 'phoneNumber' })
  phone_number: string | null;

  @ApiProperty({ example: true })
  @Expose({ name: 'newsletterOptIn' })
  newsletter_opt_in: boolean | null;

  @Exclude()
  password_hash: string;

  @Expose({ name: 'createdAt' })
  @ApiProperty()
  created_at: Date | null;

  constructor(partial: Partial<UserWithRoleEntityEntity>) {
    Object.assign(this, partial);
  }
}
