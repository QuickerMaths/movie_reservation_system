import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegularUserDto {
  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @ApiProperty({ example: 'pass123' })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '+123456789' })
  phoneNumber?: string;

  @IsBoolean()
  @ApiProperty({ example: true })
  newsletterOptIn: boolean;
}
