export class Result<Entity>{
    Data?:Entity;
    Message?:string;
    Success:boolean = true;
    Token?:string;
    TotalOrders?:number;
}