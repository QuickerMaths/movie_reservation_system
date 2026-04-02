import { ApiProperty } from '@nestjs/swagger';

type UserEntitySource = {
  user_id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  password_hash?: string;
  created_at?: Date | null;
};

export class UserEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  // Kept for auth flow; defined as non-enumerable in constructor so it is not serialized.
  password_hash: string;

  // Backward-compatible alias used internally by auth/guards/controllers.
  user_id: number;

  @ApiProperty()
  createdAt: Date | null;

  constructor(source: UserEntitySource) {
    this.id = source.user_id ?? 0;
    this.email = source.email ?? '';
    this.firstName = source.first_name ?? '';
    this.lastName = source.last_name ?? '';
    this.createdAt = source.created_at ?? null;

    Object.defineProperty(this, 'password_hash', {
      value: source.password_hash ?? '',
      enumerable: false,
      writable: false,
    });

    Object.defineProperty(this, 'user_id', {
      value: this.id,
      enumerable: false,
      writable: false,
    });
  }
}
