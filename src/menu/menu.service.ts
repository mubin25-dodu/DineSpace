import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { menu } from './Entity/menu.entity';
import { In, Repository } from 'typeorm';
import { Result } from 'src/SharedServices/Result';
import { ResturantService } from 'src/resturant/resturant.service';
import { MenuDto } from './Dto/menu.Dto';

@Injectable()
export class MenuService {
    constructor(@InjectRepository(menu) private readonly menurepo:Repository<menu> , private ResturantService:ResturantService){}

    async createMenu(menu:MenuDto[] , user):Promise<Result<menu[]>>{
               const result = new Result<menu[]>;
           try{
            const checkids = menu.some((e)=> e.id !== undefined);
            if(checkids){
                result.Message = "can not provide ids when creating a menu";
                result.Success = false;
                return result;
            }

            const DuplicateResturent = await this.checkdupes(menu.map(e=>e.resturentId));
            if(DuplicateResturent > 1){
                result.Message = "ambiguous resturent id found";
                result.Success = false;
                return result;
            }

            const searchResturent = await this.ResturantService.checkResturantowner(menu[0].resturentId , user.userId);
            if(!searchResturent.Success){
                result.Message = searchResturent.Message;
                result.Success = false;
                return result;
            }
            
            result.Data = await this.menurepo.save(menu);
            result.Message = "Success";
           }
           catch(e){
               result.Message = String(e);
               result.Success = false;
       
           }
               return result;
       
           } 

    async updateMenu(menu:MenuDto[] , user):Promise<Result<menu[]>>{
               const result = new Result<menu[]>;
           try{
            const checkids = menu.some((e)=> e.id === undefined);
            if(checkids){
                result.Message = "menu id missing";
                result.Success = false;
                return result;
            }
            const DuplicateResturent = await this.checkdupes(menu.map(e=>e.resturentId));
            if(DuplicateResturent > 1 ){
                result.Message = "ambiguous resturent id found"; 
                result.Success = false;
                return result;
            }

            const searchResturent = await this.ResturantService.checkResturantowner(menu[0].resturentId , user.userId);
            if(!searchResturent.Success){
                result.Message = searchResturent.Message;
                result.Success = false;
                return result;
            }
            const ids = menu.map(e=> e.id)
            const chekids = await this.menurepo.find({where:{id: In(ids)}});
            if(ids.length !== chekids.length){
                result.Success = false;
                result.Message = 'One or more menu ids do not exist';
                return result;
            }

            result.Data = await this.menurepo.save(menu);
            result.Message = "Success";
           }
           catch(e){
               result.Message = String(e);
               result.Success = false;
       
           }
               return result;
       
           } 

    async deleteitem(id:string, user):Promise<Result<menu>>{
               const result = new Result<menu>;
           try{
            const getitem = await this.menurepo.findOne({where:{id:id}});
            if(getitem == null){
                result.Message ="Item not found";
                result.Success = false;
                return result;
            }
            const chekowner = await this.ResturantService.checkResturantowner(getitem.resturentId , user.userId);
            if(!chekowner.Success){
                result.Message = chekowner.Message;
                result.Success = false;
                return result;
            }
            result.Data = await this.menurepo.remove(getitem);
            result.Message = "Success";
           }
           catch(e){
               result.Message = String(e);
               result.Success = false;
       
           }
               return result;
       
           } 

    async getall(id:string):Promise<Result<menu[]>>{
               const result = new Result<menu[]>;
           try{
            const getitem = await this.menurepo.find({where:{resturentId:id}});
            if(getitem == null){
                result.Message ="No Items found";
                result.Success = false;
                return result;
            }
            result.Data = getitem;
            result.Message = `${getitem.length} items Found`;
           }
           catch(e){
               result.Message = String(e);
               result.Success = false;
       
           }
               return result;
       
           } 
    
    async Isavailable(id:string, user):Promise<Result<menu>>{
                const result = new Result<menu>;
            try{
                const getitem = await this.menurepo.findOne({where:{id:id}});
                if(getitem == null){
                    result.Message ="Item not found";
                    result.Success = false;
                    return result;
                }
                const chekowner = await this.ResturantService.checkResturantowner(getitem.resturentId , user.userId);
                if(!chekowner.Success){
                    result.Message = chekowner.Message;
                    result.Success = false;
                    return result;
                }
                getitem.isAvailable = !getitem.isAvailable;
                result.Data = await this.menurepo.save(getitem);
                result.Message = "Success";
            }
            catch(e){
                result.Message = String(e);
                result.Success = false;
        
            }
                return result;
        
          } 

    async checkdupes(data:any[]):Promise<number>{
            const length = new Set(data).size;
            return length;
        }
    
}
