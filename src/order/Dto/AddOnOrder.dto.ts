import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { PaymentDto } from "src/payment/Dto/payment.dto";
import { OrderStatus } from "../enum/OrderStatus.enum";
import { OrderItemDto } from "./OrderItem.Dto";
import { PrimaryGeneratedColumn } from "typeorm";

export class AddOnOrderDto {
    @ApiProperty({ type: String, example: "7d6c5f7a-2d11-4d9f-b255-d4e9d5e5f123" })
    @PrimaryGeneratedColumn('uuid')
    @IsNotEmpty()
    orderId!: string;

    @ApiProperty({ required: false, example: 0 })
    @IsOptional()
    @IsNumber()
    payable?: number;

    @ApiProperty({ required: false, example: 0 })
    @IsOptional()
    @IsNumber()
    discount?: number;

    @ApiProperty({ enum: OrderStatus, required: false, default: OrderStatus.Pending })
    @IsOptional()
    @IsEnum(OrderStatus)
    OrderStatus?: OrderStatus;

    @ApiProperty({ type: [OrderItemDto] })
    @IsDefined()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderitems!: OrderItemDto[];

    @ApiProperty({ type: PaymentDto })
    @IsDefined()
    @ValidateNested()
    @Type(() => PaymentDto)
    payment!: PaymentDto;
}
