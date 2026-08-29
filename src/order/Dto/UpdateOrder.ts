import { PartialType } from "@nestjs/swagger";
import { OrderDto } from "./Order.Dto";
import { PlaceorderDto } from "./placeOrder.dto";
import { Order } from "../Entity/Order.entity";

export class UpdateOrderDto extends PartialType(OrderDto){} 