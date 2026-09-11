import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentStatus } from "../Enum/PaymentStatus.enum";
import { paymentMethod } from "../Enum/PaymentMethode.enum";

export class PaymentDto {

    @ApiProperty({ required: false, example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
    @IsOptional()
    @IsUUID()
    id?: string;

    @ApiProperty({ enum: paymentMethod, example: paymentMethod.Cash })
    @IsEnum(paymentMethod)
    paymentMethode: paymentMethod = paymentMethod.Cash;

    @IsOptional()
    @ApiProperty({ required: false, example: "1234567890" })
    @IsString()
    acountNumber?: string;

    @IsOptional()
    @ApiProperty({ required: false, example: "1234567890" })
    status?:PaymentStatus;

    @IsOptional()
    @ApiProperty({ required: false, example: "1234567890" })
    transectionId?:string;

    @IsOptional()
    @ApiProperty({ required: false, example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
    orderId?: string;

    @IsOptional()
    @ApiProperty({ required: false, example: "bd4198ca-952f-46fc-9e47-7428d1b8180d" })
    addOnOrderId?: string;

    @IsOptional()
    @ApiProperty({ required: false, example: 125.5 })
    amount?: number;
}