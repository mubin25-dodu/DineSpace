import { VerificationType } from "src/verification-request/Enum/verification-type.enum";

export class Result<Entity>{
    Data?:Entity;
    Message?:string;
    Success:boolean = true;
    Token?:string;
    VerificationType?:VerificationType;
    TotalOrders?:number;
}