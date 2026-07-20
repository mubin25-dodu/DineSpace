import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, Min, IsEmail } from 'class-validator';
import { VerificationType } from '../Enum/verification-type.enum';

export class CreateVerificationRequestDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(VerificationType)
  type!: VerificationType;

  @IsString()
  @IsNotEmpty()
  targetValue!: string;

  @IsString()
  token?: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  currentemail!: string;

  @IsOptional()
  @IsString()
  expiresAt?: Date;

  @IsOptional()
  @IsInt()
  @Min(0)
  attempts?: number;
}