import { PartialType } from "@nestjs/mapped-types";
import { Resturant } from "../Entity/Resturant.entity";

export class PartialResturantDto extends PartialType(Resturant){}