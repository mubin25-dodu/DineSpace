import { IsBoolean, IsDate, IsEmail, IsNotEmpty, Matches } from "class-validator";
import { Column } from "typeorm";

export class RegistrationDto{
    @IsNotEmpty()
    @IsEmail()
    email:string;
    @IsEmail()
    Resturantemail:string;
    @IsNotEmpty()
    password:string;
    @IsNotEmpty()
    role:string = "user";
    @IsNotEmpty()
    resturantName:string;
    @IsNotEmpty()
    address:string;
    @IsNotEmpty()
    @IsBoolean()
    isopen:boolean;
    @IsNotEmpty()
    @Matches(/^(?:\+?88)?01[3-9]\d{8}$/ , {message:"Invalid phone number (e.g., +8801XXXXXXXX or 01XXXXXXXX)."})
    phone:string;
    @IsNotEmpty()
    @Matches(/^(?:1[0-2]|0?[1-9]):[0-5]\d\s?(?:[Aa][Mm]|[Pp][Mm])$/, {message: "Time must be in 12-hour format with AM/PM (e.g., 12:40 PM or 09:30 AM)."})
    opening:string;
    @IsNotEmpty()
    @Matches(/^(?:1[0-2]|0?[1-9]):[0-5]\d\s?(?:[Aa][Mm]|[Pp][Mm])$/, {message: "Time must be in 12-hour format with AM/PM (e.g., 12:40 PM or 09:30 AM)."})
    closing:string;
    @IsNotEmpty()
    @IsBoolean()
    payfirst:boolean; 
}