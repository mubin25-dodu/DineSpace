import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { paymentMethod } from "../Enum/PaymentMethode.enum";

export class FakePaymentDto {
    @ApiProperty({ example: "Fake-3fa85f64-5717-4562-b3fc-2c963f66afa6" })
    @IsNotEmpty()
    transectionId!: string;

    @ApiProperty({ enum: paymentMethod, example: paymentMethod.Card })
    @IsEnum(paymentMethod)
    paymentMethode!: paymentMethod;

    @ApiProperty({ example: 125.5, minimum: 0.01 })
    @IsNumber()
    @Min(0.01)
    amount!: number;

    @ApiPropertyOptional({
        example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    })
    @IsOptional()
    @IsUUID()
    orderId?: string;

    @ApiPropertyOptional({
        example: "bd4198ca-952f-46fc-9e47-7428d1b8180d",
    })
    @IsOptional()
    @IsUUID()
    addOnOrderId?: string;

    @ApiPropertyOptional({ example: "1234567890" })
    @IsOptional()
    @IsString()
    acountNumber?: string;
}
