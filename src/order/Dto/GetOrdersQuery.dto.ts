import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { OrderStatus } from '../enum/OrderStatus.enum';

export class GetOrdersQueryDto {
  @ApiPropertyOptional({
    description: 'Search part of an order ID or customer phone number',
    example: '01712',
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({
    enum: [...Object.values(OrderStatus), 'all'],
    description: 'Filter by order status, or all',
  })
  @IsOptional()
  @IsEnum({ ...OrderStatus, all: 'All' })
  status?: OrderStatus | 'All';
}

export class GetOrdersPageQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, description: 'Page number (50 orders per page)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;
}