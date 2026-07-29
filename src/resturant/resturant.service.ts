import { Injectable } from '@nestjs/common';
import { ResturantDto } from './DTO/Resturant.Dto';
import { Result } from 'src/SharedServices/Result';
import { InjectRepository } from '@nestjs/typeorm';
import { Resturant } from './Entity/Resturant.entity';
import { Like, Repository } from 'typeorm';
import { PartialResturantDto } from './DTO/ParticalResturant.Dto';
import { use } from 'passport';

@Injectable()
export class ResturantService {

    constructor(@InjectRepository(Resturant) private readonly Resreo: Repository<Resturant>) { }

    async addresturant(data: ResturantDto): Promise<Result<ResturantDto>> {
        const result = new Result<ResturantDto>;
        try {
            const check = await this.Findbyemail(data.Resturantemail) || await this.Findbyphone(data.phone);

            if (check.Success) {
                result.Message = check.Message;
                result.Success = false;
                return result;
            }
            const create = await this.Resreo.save(data);
            if (create) {
                result.Data = create;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }
    async Findbyemail(email: string): Promise<Result<ResturantDto>> {
        const result = new Result<ResturantDto>;
        try {
            const create = await this.Resreo.findOne({ where: { Resturantemail: email } });
            if (create != null) {
                result.Data = create;
                result.Message = `Resturant with email ${email} Found`;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }
    async getall(user:any): Promise<Result<Resturant[]>> {
        const result = new Result<Resturant[]>;
        try {
            if(user.role == "admin"){
            const get = await this.Resreo.find({ relations: { files: true, tables: true, menu: true } });
            if (get != null) {
                result.Data = get;
            }
            result.Message = `${get.length} resturent Found`;
            return result;

            }
            const get = await this.Resreo.find({where:{ownerid:user.userId} , relations:{files:true, tables:true , menu:true}});
            if (get != null) {
                result.Data = get;
                result.Message = `${get.length} resturent Found`;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }

    async Findbyphone(phone: string): Promise<Result<ResturantDto>> {
        const result = new Result<ResturantDto>;
        try {
            const create = await this.Resreo.findOne({ where: { phone: phone } });
            if (create != null) {
                result.Data = create;
                result.Message = `Resturant with Phone ${phone} Found`;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }

    async Updateresturant(data: PartialResturantDto , user:any): Promise<Result<Resturant>> {
        const result = new Result<Resturant>;
        try {
            // const check = await this.Findbyemail(data.Resturantemail) || await this.Findbyphone(data.phone);

            // if (check.Success) {
            //     result.Message = check.Message + "try another one";
            //     result.Success = false;
            //     return result;
            // }

            if(data.Resturantemail!== undefined || data.phone !== undefined){
                 result.Message ="Can not update email and Phone At this moment";
                result.Success = false;
                return result;
            }
            const getresturent = await this.FindbyID(data.id!);
            if (!getresturent.Success || !getresturent.Data) {
                result.Success = false;
                result.Message = "Restaurant not found";
                return result;
            }
            if(getresturent.Data.ownerid !== user.userId){
                result.Message ="you do not have parmition to update the resturant";
                result.Success = false;
                return result;
            }

            Object.assign(getresturent.Data , data)
            const create = await this.Resreo.save(getresturent.Data);
            if (create) {
                result.Data = create;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }

    async search(term: string): Promise<Result<Resturant[]>> {
        const result = new Result<Resturant[]>;
        try {
            const search = await this.Resreo.find({
                where: [
                    { resturantName: Like(`%${term}%`) },
                    { Resturantemail: Like(`%${term}%`) },
                    { address: Like(`%${term}%`) } ,

                ],
                relations:{owner:true , tables:true , menu:true , files:true}
            });
            if (search != null) {
                result.Data = search;
                result.Message = `${search.length} Resturents Found`;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }

    // async Uploadfiles(file: Express.Multer.File[], id: string, uploadfor: fileEnum, userId: any): Promise<Result<Resturant>> {
    //     const result = new Result<Resturant>;
    //     try {
    //         const fileDtos: FilesDto[] = file.map(file => ({
    //             FileName: file.filename,
    //             OriginalName: file.originalname,
    //             Path: file.path,
    //             Size: file.size,
    //             UploadedByUserId: userId,
    //             RestaurantId: uploadfor == fileEnum.Resturant ? id : undefined,
    //             MenuId: uploadfor == fileEnum.Menu ? id : undefined,
    //         }));
    //         const save = await this.fileservice.addfiles(fileDtos);
    //         if (!save.Success) {
    //             result.Message = save.Message;
    //             result.Success = false;
    //             return result;
    //         }
    //         result.Message = "images saved successfully"
    //         return result;
    //     }
    //     catch (e) {
    //         result.Message = String(e);
    //         result.Success = false;

    //     }
    //     return result;
    // }

    async deleteresturant(user:any , resturantId:string):Promise<Result<null>>{
        const result = new Result<null>;
    try{
        const checkResturantOwner = await this.Resreo.findOne({where:{id:resturantId , ownerid:user.userId}})
        if(checkResturantOwner !==  null){
            await this.Resreo.remove(checkResturantOwner);
            result.Message = "Resturant deleted";
            return result;
        }
        result.Message ="you are not the owner or wrong resturent Id";
        result.Success = false;
    }
    catch(e){
        result.Message = String(e);
        result.Success = false;
    }
        return result;
    }
    async FindbyID(id: string): Promise<Result<Resturant>> {
        const result = new Result<Resturant>;
        try {
            const create = await this.Resreo.findOne({ where: { id:id } , relations:{tables:true} });
            if (create != null) {
                result.Data = create;
                result.Message = `Resturant Found`;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }
    async checkResturantowner(resturantid: string , ownerid:string): Promise<Result<Resturant>> {
        const result = new Result<Resturant>;
        try {
            const create = await this.Resreo.findOne({ where: { id:resturantid , ownerid:ownerid } });
            if (create != null) {
                result.Data = create;
                result.Message = `is a valid owner`;
                return result;
            }
            result.Message = `Not a valid owner`;
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }

    
}
