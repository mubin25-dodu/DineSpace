import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CheckOrderStatusDto {
  @ApiProperty({
    type: [String],
    example: ['8c1f6f1e-4a2c-4d5b-9c6e-7f8a9b0c1d2e'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  orderIds!: string[];
}
