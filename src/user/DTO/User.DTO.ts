import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, Matches, IsString, MinLength, MaxLength } from "class-validator";

export class UserDto{
    @IsOptional()
    @ApiProperty()
    @IsString()
    id?:string;
    @IsNotEmpty({ message: "Email is required" })
    @IsEmail({}, { message: "Email must be valid" })
    @ApiProperty()
    @IsString()
    email!:string;
    
    @IsNotEmpty({ message: "Password is required" })
    @IsString({ message: "Password must be a string" })
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    @MaxLength(50, { message: "Password cannot exceed 50 characters" })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
    { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)" })
    @ApiProperty()
    password!:string;

}