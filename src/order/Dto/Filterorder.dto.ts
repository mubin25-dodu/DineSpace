import { IsNotEmpty, IsOptional } from "class-validator";
import { Order } from "../Entity/Order.entity";
import { OrderStatus } from "../enum/OrderStatus.enum";
import { PaymentStatus } from "src/payment/Enum/PaymentStatus.enum";

export class filterDto {
@IsNotEmpty()
ResturentId!:string;

@IsOptional()
Status?:OrderStatus;
@IsOptional()
paymentstatus?:PaymentStatus;

}