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
    Resturantemail!:string;
    @IsNotEmpty()
    @ApiProperty()
     @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
    { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)" })
    password!:string;
    // @IsNotEmpty()
    // @ApiProperty()
    // role?:string;
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
    @Matches(/^(?:1[0-2]|0?[1-9]):[0-5]\d\s?(?:[Aa][Mm]|[Pp][Mm])$/, {message: "Time must be in 12-hour format with AM/PM (e.g., 12:40 PM or 09:30 AM)."})
    @ApiProperty()
    opening!:string;
    @IsNotEmpty()
    @Matches(/^(?:1[0-2]|0?[1-9]):[0-5]\d\s?(?:[Aa][Mm]|[Pp][Mm])$/, {message: "Time must be in 12-hour format with AM/PM (e.g., 12:40 PM or 09:30 AM)."})
    @ApiProperty()
    closing!:string;
    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    payfirst!:boolean; 
}