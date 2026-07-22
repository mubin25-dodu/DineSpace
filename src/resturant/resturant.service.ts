import { Injectable } from '@nestjs/common';
import { ResturantDto } from './DTO/Resturant.Dto';
import { Result } from 'src/SharedServices/Result';
import { InjectRepository } from '@nestjs/typeorm';
import { Resturant } from './Entity/Resturant.entity';
import { Like, Or, Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { Files } from 'src/files/Entity/Files.Entity';
import { Express } from 'express';
import { fileEnum } from 'src/files/Enum/files.Enum';
import { FilesDto } from 'src/files/DTO/Files.Dto';

@Injectable()
export class ResturantService {

    constructor(@InjectRepository(Resturant) private readonly Resreo:Repository<Resturant> , private fileservice:FilesService){}

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

    async search(term:string):Promise<Result<ResturantDto[]>>{
            const result = new Result<ResturantDto[]>;
        try{
            const create = await this.Resreo.find({where: [
                { resturantName: Like(`%${term}%`) },
                { Resturantemail: Like(`%${term}%`) },
                { address: Like(`%${term}%`) }
            ]});
            if(create != null){
                result.Data = create;
                result.Message = `Resturant with email ${term} Found`;
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

    async Uploadfiles(file:Express.Multer.File[] , id:string , uploadfor:fileEnum , userId:any):Promise<Result<Resturant>>{
           const result = new Result<Resturant>;
        try{
            const fileDtos: FilesDto[] = file.map(file => ({
                FileName: file.filename,
                OriginalName: file.originalname,
                Path: file.path,
                Size: file.size,
                UploadedByUserId: userId,
                RestaurantId: uploadfor == fileEnum.Resturant ? id : undefined,
                MenuId: uploadfor == fileEnum.Menu ? id : undefined,
            }));
            const save = await this.fileservice.addfiles(fileDtos);
            if(!save.Success){
                result.Message = save.Message;
                result.Success = false ;
                return result;
            }
            result.Message = "images saved successfully"
            return result;
        }
        catch(e){
            result.Message = String(e);
            result.Success = false;
    
        }
        return result;
    }
}
