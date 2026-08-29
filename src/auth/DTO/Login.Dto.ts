import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class loginDto{
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email!:string;
    @IsNotEmpty()
    @ApiProperty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/ , 
    { message:"Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."})
    password!:string;
}