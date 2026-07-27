import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentStatus } from "../Enum/PaymentStatus.enum";
import { paymentMethod } from "../Enum/PaymentMethode.enum";

export class PaymentDto {
    @IsUUID()
    @ApiProperty()
    id?: string;

    @IsNotEmpty()
    @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.Pending })
    @IsEnum(PaymentStatus)
    status: PaymentStatus = PaymentStatus.Pending;

    @ApiProperty({ enum: paymentMethod, example: paymentMethod.Cash })
    @IsEnum(paymentMethod)
    paymentMethode: paymentMethod = paymentMethod.Cash;

    @IsOptional()
    @ApiProperty({ required: false, example: "txn_123456" })
    transectionId?: string;

    @IsOptional()
    @ApiProperty({ required: false, example: "1234567890" })
    acountNumber?: string;

    @IsOptional()
    @ApiProperty({ required: false, example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
    orderId?: string;
}