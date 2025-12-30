import { IsDateString, IsOptional } from 'class-validator';

export class GetShowsDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
