import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ResturantDto } from './DTO/Resturant.Dto';
import { Result } from 'src/SharedServices/Result';
import { InjectRepository } from '@nestjs/typeorm';
import { Resturant } from './Entity/Resturant.entity';

@Injectable()
export class ResturantService {

    constructor(@InjectRepository(Resturant) private readonly Resreo:Repository<Resturant>){}

    async addresturant(data:ResturantDto):Promise<Result<ResturantDto>>{
            const result = new Result<ResturantDto>;
        try{
            if(!(await this.Findbyemail(data.email)).Success || !await this.Findbyphone(data.phone)){ 
                result.Message ="Resturant already exists"; result.Success = false;
                 return result;}

            const create = await this.Resreo.save(data); 
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

        async Findbyemail(email:string):Promise<Result<ResturantDto>>{
            const result = new Result<ResturantDto>;
        try{
            const create = await this.Resreo.findOne({where:{email:email}}); 
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
        async Findbyphone(phone:string):Promise<Result<ResturantDto>>{
            const result = new Result<ResturantDto>;
        try{
            const create = await this.Resreo.findOne({where:{phone:phone}}); 
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
