import { PartialType } from "@nestjs/swagger";
import { menu } from "../Entity/menu.entity";

export class PartialmenuDto extends PartialType(menu){}