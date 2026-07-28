import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class FeedbackDTO {
  @ApiProperty({
    description: 'Unique Order ID associated with the feedback',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  orderId!: string;

  @ApiProperty({
    description: 'Customer rating (1 to 5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional({
    description: 'Optional customer feedback comment',
    example: 'Excellent food and very fast service.',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}