import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class loginDto{
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email!:string;
    @IsNotEmpty()
    @ApiProperty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ , 
    { message:"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."})
    password!:string;
}