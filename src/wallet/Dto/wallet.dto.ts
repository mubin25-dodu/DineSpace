import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class WalletDto {
    @ApiProperty({ example: 2500.75, default: 0 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    balance!: number;

    @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
    @IsNotEmpty()
    @IsUUID()
    restaurantId!: string;
}
