import { PartialType } from "@nestjs/swagger";

import { Payment } from "../Entity/payment.entity";

export class partialPaymentDto extends PartialType(Payment){}