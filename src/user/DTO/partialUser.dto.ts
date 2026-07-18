import { PartialType } from "@nestjs/mapped-types";
import { UserDto } from "./User.DTO";

export class PartialUserDto extends PartialType(UserDto){}