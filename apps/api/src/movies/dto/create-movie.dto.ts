import {
  IsString,
  IsInt,
  IsOptional,
  IsUrl,
  IsBoolean,
  Min,
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsDecimal,
} from 'class-validator';

export class CreateMovieDto {
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  posterImageUrl?: string;

  @IsDecimal()
  @IsNotEmpty()
  cachedRating: number;

  @IsInt()
  @Min(1)
  durationMinutes: number;

  @IsDate()
  @IsNotEmpty()
  lastShowDate: Date;

  @IsBoolean()
  @IsOptional()
  isRecommended?: boolean;

  @IsInt()
  @IsNotEmpty()
  genreId: number;
}
