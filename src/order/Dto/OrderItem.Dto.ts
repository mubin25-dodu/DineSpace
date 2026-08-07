import { ApiProperty } from "@nestjs/swagger";
import {IsNumber , IsOptional, IsString,IsUUID,Min,} from "class-validator";


export class OrderItemDto {
	@IsUUID()
	@IsString()
    @ApiProperty()
	itemId!: string;
	
	@IsUUID()
	@IsOptional()
    @ApiProperty()
	orderId?:string;

	@IsNumber()
    @ApiProperty()
	@Min(1, { message: "Quantity must be at least 1" })
	quantity!: number;

    @ApiProperty()
	@IsNumber()
	@Min(0, { message: "Price cannot be negative" })
	price!: number;
}