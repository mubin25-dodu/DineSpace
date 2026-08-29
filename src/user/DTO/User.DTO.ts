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
    
    @IsOptional()
    @ApiProperty()
    @IsString()
    role?:string;

    @IsNotEmpty({ message: "Password is required" })
    @IsString({ message: "Password must be a string" })
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    @MaxLength(20, { message: "Password cannot exceed 20 characters" })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/, 
    { message: "Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." })
    @ApiProperty()
    password!:string;
}