import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class RegistrationDto{
    @IsOptional()
    @IsString()
    ownerid!:string;
    @IsNotEmpty()
    @IsEmail()
    email!:string;
    @IsEmail()
    Resturantemail!:string;
    @IsNotEmpty()
     @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
    { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)" })
    password!:string;
    @IsNotEmpty()
    role:string = "user";
    @IsNotEmpty()
    resturantName!:string;
    @IsNotEmpty()
    address!:string;
    @IsNotEmpty()
    @IsBoolean()
    isopen!:boolean;
    @IsNotEmpty()
    @Matches(/^(?:\+?88)?01[3-9]\d{8}$/ , {message:"Invalid phone number (e.g., +8801XXXXXXXX or 01XXXXXXXX)."})
    phone!:string;
    @IsNotEmpty()
    @Matches(/^(?:1[0-2]|0?[1-9]):[0-5]\d\s?(?:[Aa][Mm]|[Pp][Mm])$/, {message: "Time must be in 12-hour format with AM/PM (e.g., 12:40 PM or 09:30 AM)."})
    opening!:string;
    @IsNotEmpty()
    @Matches(/^(?:1[0-2]|0?[1-9]):[0-5]\d\s?(?:[Aa][Mm]|[Pp][Mm])$/, {message: "Time must be in 12-hour format with AM/PM (e.g., 12:40 PM or 09:30 AM)."})
    closing!:string;
    @IsNotEmpty()
    @IsBoolean()
    payfirst!:boolean; 
}