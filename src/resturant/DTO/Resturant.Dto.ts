import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, Matches } from "class-validator";

export class ResturantDto {
    @IsOptional()
    id?:string;
    @IsNotEmpty()
    resturantName!: string;
    @IsNotEmpty()
    @IsOptional()
    address?: string;
    @IsBoolean()
    @IsNotEmpty()
    isopen!: boolean;
    @Matches(/^(?:1[0-2]|0?[1-9]):[0-5]\d\s?(?:[Aa][Mm]|[Pp][Mm])$/, {message: "Time must be in 12-hour format with AM/PM (e.g., 12:40 PM or 09:30 AM)."})
    @IsNotEmpty()
    opening!: string;
    @Matches(/^(?:\+?88)?01[3-9]\d{8}$/ , {message:"Invalid phone number (e.g., +8801XXXXXXXX or 01XXXXXXXX)."})
    @IsNotEmpty()
    phone!: string;
    @IsEmail()
    @IsNotEmpty()
    email!: string;
    @IsNotEmpty()
    @Matches(/^(?:1[0-2]|0?[1-9]):[0-5]\d\s?(?:[Aa][Mm]|[Pp][Mm])$/, {message: "Time must be in 12-hour format with AM/PM (e.g., 12:40 PM or 09:30 AM)."})
    closing!: string;
    @IsBoolean()
    @IsNotEmpty()
    payfirst!: boolean;
}