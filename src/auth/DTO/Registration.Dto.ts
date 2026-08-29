import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class RegistrationDto{
    @IsOptional()
    @IsString()
    @ApiProperty()
    ownerid!:string;
    @IsNotEmpty()
    @ApiProperty()
    @IsEmail()
    email!:string;
    @ApiProperty()
    @IsEmail()
    resturantemail!:string;
    @IsNotEmpty()
    @ApiProperty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/, 
    { message: "Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." })
    password!:string;
    @IsNotEmpty()
    @ApiProperty()
    resturantName!:string;
    @IsNotEmpty()
    @ApiProperty()
    address!:string;
    @IsNotEmpty()
    @ApiProperty()
    @IsBoolean()
    isopen!:boolean;
    @IsNotEmpty()
    @Matches(/^(?:\+?88)?01[3-9]\d{8}$/ , {message:"Invalid phone number (e.g., +8801XXXXXXXX or 01XXXXXXXX)."})
    @ApiProperty()
    phone!:string;
    @IsNotEmpty()
    @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/ , {message: "Time must be in 24-hour format (e.g., 13:40 or 09:30)."})
    @ApiProperty()
    opening!:string;
    @IsNotEmpty()
    @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/ , {message: "Time must be in 24-hour format (e.g., 13:40 or 09:30)."})
    @ApiProperty()
    closing!:string;
    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    payfirst!:boolean; 
}