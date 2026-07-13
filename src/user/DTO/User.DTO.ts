import { IsEmail, IsNotEmpty, IsOptional, Matches } from "class-validator";

export class UserDto{
    @IsNotEmpty()
    @IsEmail()
    email:string;
    @IsNotEmpty()
    resturantid:string;
     @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ , 
    { message:"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."})
    password:string;
    @IsOptional()
    role:string;
}