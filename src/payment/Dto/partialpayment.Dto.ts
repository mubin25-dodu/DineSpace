import { PartialType } from "@nestjs/swagger";

import { Payment } from "../Entity/payment.entity";
import { PaymentDto } from "./payment.dto";

export class partialPaymentDto extends PartialType(PaymentDto){}