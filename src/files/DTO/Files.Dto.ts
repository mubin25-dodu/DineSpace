import { Type } from "class-transformer";
import {  IsNotEmpty, IsString, MaxLength } from "class-validator";
import { fileEnum } from "../Enum/files.Enum";
import { ApiProperty } from "@nestjs/swagger";

export class FilesDto{
        @ApiProperty()
        id?: string;
        @IsNotEmpty()
        @ApiProperty()
        @IsString()
        @MaxLength(250)
        FileName!: string;
    
        @IsNotEmpty()
        @ApiProperty()
        @IsString()
        @MaxLength(250)
        OriginalName!: string;
    
        @IsNotEmpty()
        @ApiProperty()
        @IsString()
        @MaxLength(500)
        Path!: string;
    
        @IsNotEmpty()
        @ApiProperty()
        @Type(()=> Number)
        Size!: number;
        
        @IsNotEmpty()
        @ApiProperty()
        UploadedByUserId!: string;
        @ApiProperty()
        RestaurantId?: string;
        @ApiProperty()
        MenuId?: string;
        @IsNotEmpty()
        @ApiProperty()
        filefor!:fileEnum;
}