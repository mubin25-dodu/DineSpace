import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class loginDto{
    @IsNotEmpty()
    @IsEmail()
    email!:string;
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ , 
    { message:"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."})
    password!:string;
}