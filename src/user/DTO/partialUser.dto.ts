import { PartialType } from "@nestjs/swagger";

import { UserDto } from "./User.DTO";

export class PartialUserDto extends PartialType(UserDto){}