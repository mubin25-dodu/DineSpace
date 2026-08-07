import type { UUID } from "crypto";
import { OrderItemDto } from "./OrderItem.Dto";
import { OrderDto } from "./Order.Dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Payment } from "src/payment/Entity/payment.entity";
import { PaymentDto } from "src/payment/Dto/payment.dto";

export class PlaceorderDto {
    @ApiProperty({ type: OrderDto })
    @IsDefined()
    @ValidateNested()
    @Type(() => OrderDto)
    orderdetails!: OrderDto;

    @ApiProperty({ type: [OrderItemDto] })
    @IsDefined()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderitems!: OrderItemDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    payment!:PaymentDto;
}