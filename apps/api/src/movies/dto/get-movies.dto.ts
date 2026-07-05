import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { toOptionalNumber, toOptionalBoolean, toTrimmedString } from '../../../helpers/helpers';

export const movieSortFields = [
  'title',
  'cachedRating',
  'durationMinutes',
  'lastShowDate',
] as const;

export type MovieSortField = (typeof movieSortFields)[number];

export class GetMoviesDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 12, minimum: 1, maximum: 100 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  genreId?: number;

  @ApiPropertyOptional({ example: 'matrix', description: 'Case-insensitive search by movie title' })
  @IsOptional()
  @Transform(toTrimmedString)
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ example: 7.5, minimum: 0, maximum: 10 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsNumber()
  @Min(0)
  @Max(10)
  minRating?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toOptionalBoolean)
  @IsBoolean()
  isRecommended?: boolean;

  @ApiPropertyOptional({ enum: movieSortFields, example: 'title' })
  @IsOptional()
  @IsIn(movieSortFields)
  sortBy?: MovieSortField;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
