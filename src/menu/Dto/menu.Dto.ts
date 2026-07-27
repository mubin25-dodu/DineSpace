import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, min } from "class-validator";

export class MenuDto{
	@ApiProperty()
	@IsOptional()
	id?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	resturentId!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	itemName!: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
    @Min(1)
	price!: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty()
	@IsBoolean()
	@IsNotEmpty()
	isAvailable!: boolean;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	catagory!: string;
}
