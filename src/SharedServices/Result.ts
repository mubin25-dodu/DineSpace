export class Result<Entity>{
    Data?:Entity;
    Message?:string;
    Success:boolean = true;
    tocken?:string;
}