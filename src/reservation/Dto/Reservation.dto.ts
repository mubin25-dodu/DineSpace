import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { ReservationStatus } from "../Enum/reservationstatus.enum";


export class ReservationDto {

  id?: string;  

  @IsDateString()
  reservationDate!: Date;

  @IsNotEmpty()
  @IsString()
  reservationTime!: string;

  @IsInt()
  @Min(1)
  guestCount!: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  specialRequest?: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

 @IsOptional()
@IsString()
userId?: string;

  @IsNotEmpty()
  @IsString()
  restaurantId!: string;

  @IsNotEmpty()
  @IsString()
  tableId!: string;
}