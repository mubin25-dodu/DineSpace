import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ResturantDto } from './DTO/Resturant.Dto';
import { Result } from 'src/SharedServices/Result';
import { Resturant } from 'src/Database/Entity/Resturant.entity';

@Injectable()
export class ResturantService {

    constructor(private Dbcontext:EntityManager){}

    async addresturant(data:ResturantDto):Promise<Result<Resturant>>{
            const result = new Result<Resturant>;
        try{
            if(!(await this.Findbyemail(data.email)).Success || !await this.Findbyphone(data.phone)){ 
                result.Message ="Resturant already exists"; result.Success = false;
                 return result;}

            const create = await this.Dbcontext.save(Resturant,data); 
            if(create){
                result.Data = create;
                return result;
            }
            result.Success = false;
        }
        catch(e){
            result.Message = String(e);
            result.Success = false;
    
        }
            return result;
        }

        async Findbyemail(email:string):Promise<Result<Resturant>>{
            const result = new Result<Resturant>;
        try{
            const create = await this.Dbcontext.findOne(Resturant,{where:{email:email}}); 
            if(create){
                result.Data = create;
                return result;
            }
            result.Success = false;
        }
        catch(e){
            result.Message = String(e);
            result.Success = false;
    
        }
            return result;
        }
        async Findbyphone(phone:string):Promise<Result<Resturant>>{
            const result = new Result<Resturant>;
        try{
            const create = await this.Dbcontext.findOne(Resturant,{where:{phone:phone}}); 
            if(create){
                result.Data = create;
                return result;
            }
            result.Success = false;
        }
        catch(e){
            result.Message = String(e);
            result.Success = false;
    
        }
            return result;
        }
}
