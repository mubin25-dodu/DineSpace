import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class emailDto{
    @IsNotEmpty()
    @IsEmail({},{each:true})
    @ApiProperty()
    recipients!:string[];
    @ApiProperty()
    @IsNotEmpty()
    subject!:string;
    @ApiProperty()
    @IsNotEmpty()
    html!:string;
    @IsOptional()
    @ApiProperty()
    @IsString()
    text!:string[];
}