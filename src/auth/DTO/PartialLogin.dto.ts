import { PartialType } from "@nestjs/mapped-types";
import { loginDto } from "./Login.Dto";

export class loginPartialDto extends PartialType(loginDto){}