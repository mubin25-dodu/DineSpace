import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "../enum/OrderStatus.enum";
import {IsArray,IsDate,IsEnum,	IsNotEmpty,	isNumber,	IsNumber,IsOptional,IsString,IsUUID,isUUID,ValidateNested} from "class-validator";

export class OrderDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()    
    id?:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()    
    tableId!:string;

    @IsNotEmpty()    
    @IsNumber()
    @ApiProperty()
    payable!:number;

    @IsNotEmpty()    
    @IsNumber()
    @ApiProperty()
    discount?:number;

    @IsEnum(OrderStatus)
    @ApiProperty()
    OrderstStatus!:OrderStatus;
    
    @IsNotEmpty()    
    @ApiProperty()
    customerName!:string;
    
    @ApiProperty()
    @IsNotEmpty()        
    customerPhone!:number;       
}