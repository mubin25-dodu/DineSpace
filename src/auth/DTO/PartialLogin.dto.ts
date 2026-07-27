import { PartialType } from "@nestjs/swagger";
import { loginDto } from "./Login.Dto";

export class loginPartialDto extends PartialType(loginDto) {}