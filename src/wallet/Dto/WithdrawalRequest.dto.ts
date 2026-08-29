import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Length, Min } from "class-validator";
import { paymentMethod } from "src/payment/Enum/PaymentMethode.enum";
import { WithdrawalType } from "../Enum/WithdrawalType.enum";

export class WithdrawalRequestDto {
    @ApiProperty({ example: 1000.0, minimum: 100 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(100)
    amount!: number;

    @ApiProperty({ enum: WithdrawalType, example: WithdrawalType.Withdraw })
    @IsEnum(WithdrawalType)
    type!: WithdrawalType;

    @ApiProperty({ enum: paymentMethod, example: paymentMethod.Bkash })
    @IsEnum(paymentMethod)
    paymentMethod!: paymentMethod;

    @ApiProperty({ example: "01700000000" })
    @IsString()
    @IsNotEmpty()
    @Length(5, 100)
    accountNumber?: string;
}
