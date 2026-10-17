import { VerificationType } from "src/verification-request/Enum/verification-type.enum";

export class Result<Entity , Entity2 = any> {
    Data?:Entity;
    additionalData?:Entity2;
    Message?:string;
    Success:boolean = true;
    Token?:string;
    VerificationType?:VerificationType;
    TotalOrders?:number;
}