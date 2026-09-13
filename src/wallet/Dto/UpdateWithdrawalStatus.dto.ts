import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsIn, IsOptional, IsString, Length } from "class-validator";
import { WithdrawalStatus } from "../Enum/WithdrawalStatus.enum";

export class UpdateWithdrawalStatusDto {
    @ApiProperty({
        enum: [WithdrawalStatus.Approved, WithdrawalStatus.Rejected],
        example: WithdrawalStatus.Approved,
    })
    @IsEnum(WithdrawalStatus)
    @IsIn([WithdrawalStatus.Approved, WithdrawalStatus.Rejected])
    status!: WithdrawalStatus.Approved | WithdrawalStatus.Rejected;

    @ApiPropertyOptional({ example: "The account details could not be verified" })
    @IsOptional()
    @IsString()
    @Length(1, 500)
    rejectionReason?: string;
}
