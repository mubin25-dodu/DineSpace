import { PartialType } from "@nestjs/mapped-types";
import { Resturant } from "../Entity/Resturant.entity";
import { ResturantDto } from "./Resturant.Dto";

export class PartialResturantDto extends PartialType(ResturantDto){}