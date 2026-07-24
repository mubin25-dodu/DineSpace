import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TableStatus } from '../Enum/tablestatus.enum';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TableDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  id?: string;

  @ApiProperty()
  @IsString()
  status!: TableStatus;
  
  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  @Type(()=>Number)
  tableno!:number;

  @ApiProperty()
  @IsOptional()
  orderId?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  seatCapacity!: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  reservationId?: string;

  @ApiProperty()
  @IsString()
  resturantid!: string;
}

