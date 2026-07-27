import { PartialType } from "@nestjs/swagger";

import { ResturantDto } from "./Resturant.Dto";

export class PartialResturantDto extends PartialType(ResturantDto){}