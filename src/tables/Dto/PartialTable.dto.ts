import { PartialType } from "@nestjs/mapped-types";
import { TableDto } from "./Table.dto";

export class PartialTableDto extends PartialType(TableDto){}