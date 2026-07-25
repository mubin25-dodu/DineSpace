import { PartialType } from "@nestjs/mapped-types";
import { menu } from "../Entity/menu.entity";

export class PartialmenuDto extends PartialType(menu){}