import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class emailDto{
    @IsNotEmpty()
    @IsEmail({},{each:true})
    recipients!:string[];
    @IsNotEmpty()
    subject!:string;
    @IsNotEmpty()
    html!:string;
    @IsOptional()
    @IsString()
    text!:string[];
}