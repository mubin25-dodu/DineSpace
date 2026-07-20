import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, Min, IsEmail } from 'class-validator';
import { VerificationType } from '../Enum/verification-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVerificationRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId!: string;

  @IsEnum(VerificationType)
    @ApiProperty()
  type!: VerificationType;

  @IsString()
  @IsNotEmpty()
    @ApiProperty()
  targetValue!: string;

  @IsString()
    @ApiProperty()
  token?: string;

  @IsString()
    @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  currentemail!: string;

    @ApiProperty()
  @IsOptional()
  @IsString()
  expiresAt?: Date;

  @IsOptional()
  @IsInt()
  @Min(0)
    @ApiProperty()
  attempts?: number;
}