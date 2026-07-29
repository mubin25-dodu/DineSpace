import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({
    example: 'Restaurant Closed Tomorrow',
  })
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    example: 'The restaurant will remain closed tomorrow due to maintenance.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Maintenance',
    required: false,
    default: 'General',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'High',
    required: false,
    default: 'Normal',
  })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}