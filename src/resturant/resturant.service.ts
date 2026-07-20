import { Injectable } from '@nestjs/common';
import { ResturantDto } from './DTO/Resturant.Dto';
import { Result } from 'src/SharedServices/Result';
import { InjectRepository } from '@nestjs/typeorm';
import { Resturant } from './Entity/Resturant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResturantService {

    constructor(@InjectRepository(Resturant) private readonly Resreo:Repository<Resturant>){}

    async addresturant(data:ResturantDto):Promise<Result<ResturantDto>>{
            const result = new Result<ResturantDto>;
        try{
            const check = await this.Findbyemail(data.Resturantemail) ||  await this.Findbyphone(data.phone);

            if(check.Success){ 
                result.Message = check.Message; 
                result.Success = false;
                return result;
            }
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
            const create = await this.Resreo.findOne({where:{Resturantemail:email}}); 
            if(create != null){
                result.Data = create;
                result.Message = `Resturant with email ${email} Found`;
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
            if(create != null){
                result.Data = create;
                result.Message = `Resturant with Phone ${phone} Found`;
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

    async Updateresturant ( user:any , data:ResturantDto):Promise<Result<ResturantDto>>{
            const result = new Result<ResturantDto>;
        try{
            const check = await this.Findbyemail(data.Resturantemail) ||  await this.Findbyphone(data.phone);

            if(check.Success){ 
                result.Message = check.Message +"try another one";
                result.Success = false;
                return result;
            }

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
}
