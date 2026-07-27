import { PartialType } from "@nestjs/swagger";

import { TableDto } from "./Table.dto";

export class PartialTableDto extends PartialType(TableDto){}