import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { toOptionalNumber } from '../../../helpers/helpers';

export const recommendedMovieSortFields = ['cachedRating', 'title', 'lastShowDate'] as const;

export type RecommendedMovieSortField = (typeof recommendedMovieSortFields)[number];

export class GetRecommendedMoviesDto {
  @ApiProperty({ example: 1, minimum: 1 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ example: 8, minimum: 1, maximum: 100 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  genreId?: number;

  @ApiProperty({ example: 7, minimum: 0, maximum: 10 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsNumber()
  @Min(0)
  @Max(10)
  minRating?: number;

  @ApiProperty({ enum: recommendedMovieSortFields, example: 'cachedRating' })
  @IsOptional()
  @IsIn(recommendedMovieSortFields)
  sortBy?: RecommendedMovieSortField;

  @ApiProperty({ enum: ['asc', 'desc'], example: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
