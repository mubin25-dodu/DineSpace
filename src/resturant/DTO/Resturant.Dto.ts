import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsUUID, Matches } from "class-validator";

export class ResturantDto {
    @IsOptional()
    @ApiProperty()
    id?:string;
    @IsOptional()
    @ApiProperty()
    ownerid?:string;
    @ApiProperty()
    @IsNotEmpty()
    resturantName!: string;
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty()
    address?: string;
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    isopen!: boolean;
    @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/ , {message: "Time must be in 24-hour format (e.g., 13:40 or 09:30)."})
    @IsNotEmpty()
    @ApiProperty()
    opening!: string;
    @Matches(/^(?:\+?88)?01[3-9]\d{8}$/ , {message:"Invalid phone number (e.g., +8801XXXXXXXX or 01XXXXXXXX)."})
    @IsNotEmpty()
    @ApiProperty()
    phone!: string;
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    resturantemail!: string;
    @IsNotEmpty()
    @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/ , {message: "Time must be in 24-hour format (e.g., 13:40 or 09:30)."})
    @ApiProperty()
    closing!: string;
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    payfirst!: boolean;

    @IsOptional()
    @IsUUID()
    @ApiProperty({ required: false })
    logoFileId?: string;

    @IsOptional()
    @IsUUID()
    @ApiProperty({ required: false })
    coverFileId?: string;
}