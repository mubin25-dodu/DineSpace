import { Type } from "class-transformer";
import { IsDate, isDate, IsNotEmpty, IsString, isString, Max, MaxLength } from "class-validator";

export class FilesDto{
        id?: string;
        @IsNotEmpty()
        @IsString()
        @MaxLength(250)
        FileName!: string;
    
        @IsNotEmpty()
        @IsString()
        @MaxLength(250)
        OriginalName!: string;
    
        @IsNotEmpty()
        @IsString()
        @MaxLength(500)
        Path!: string;
    
        @IsNotEmpty()
        @Type(()=> Number)
        Size!: number;
        
        @IsNotEmpty()
        UploadedByUserId!: string;
        RestaurantId?: string;
        MenuId?: string;
}