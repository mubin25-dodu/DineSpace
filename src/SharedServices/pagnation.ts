import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';

export class DateFilter {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date;
}

export class Pagination {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateFilter)
  datefilter?: DateFilter;
}