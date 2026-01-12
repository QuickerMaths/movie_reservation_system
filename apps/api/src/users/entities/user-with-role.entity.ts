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

  @ApiProperty({ example: 'regural' })
  @Expose({ name: 'email' })
  role: string;

  @Exclude()
  password_hash: string;

  @Expose({ name: 'createdAt' })
  @ApiProperty()
  created_at: Date | null;

  constructor(partial: Partial<UserWithRoleEntityEntity>) {
    Object.assign(this, partial);
  }
}
