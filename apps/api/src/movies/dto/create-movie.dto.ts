import {
  IsString,
  IsInt,
  IsOptional,
  IsUrl,
  IsBoolean,
  Min,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  posterImageUrl?: string;

  @IsInt()
  @Min(1)
  durationMinutes: number;

  @IsDateString()
  @IsNotEmpty()
  lastShowDate: Date;

  @IsBoolean()
  @IsOptional()
  isRecommended?: boolean;

  @IsInt()
  @IsNotEmpty()
  genreId: number;
}
