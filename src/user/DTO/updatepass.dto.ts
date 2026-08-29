import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, isNotEmpty, Matches } from "class-validator";

export class updatePassDto{
    @IsNotEmpty()
    @ApiProperty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/, 
    { message: "Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." })
    currentPassword!:string;
    
    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/, 
    { message: "Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." })
    newPassword!:string;

    
    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/, 
    { message: "Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." })
    confirmPassword!:string;
      
}