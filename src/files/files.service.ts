import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Files } from './Entity/Files.Entity';
import { Repository } from 'typeorm';
import { FilesDto } from './DTO/Files.Dto';
import { Result } from 'src/SharedServices/Result';
import fs from 'fs/promises'
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { menu } from 'src/menu/Entity/menu.entity';
import { ResturantService } from 'src/resturant/resturant.service';
import { MenuService } from 'src/menu/menu.service';

@Injectable()
export class FilesService {
    constructor(@InjectRepository(Files) private readonly filerepo:Repository<Files> ,
    private resturentService:ResturantService,
    private menuService:MenuService){}


async addfiles( file: Express.Multer.File[], user:any , restaurantId?:string, menuId?:string ):Promise<Result<Resturant | menu>>{
       const result = new Result<Resturant | menu>;
                try{
                    if(restaurantId!=undefined && !(await this.resturentService.FindbyID(restaurantId)).Success){
                        result.Success = false;
                        result.Message = "resturant not found check the id";
                        this.deletefromproject(file);
                        return result;
                    }
                     if(menuId!=undefined && !(await this.menuService.getbyid(menuId)).Success){
                        result.Success = false;
                        result.Message = "item not found check the id";
                        this.deletefromproject(file);
                        return result;
                    }

                    const data: FilesDto[] = [];
                    for (const item of file) {
                        data.push({
                            FileName: item.filename,
                            OriginalName: item.originalname,
                            Path: item.path,
                            UploadedByUserId: user.userId,
                            Size: item.size,
                            RestaurantId: restaurantId,
                            MenuId: menuId,
                        } as FilesDto);
                    }
            
                                    
                const savedata = await this.filerepo.save(data);
                    if(!savedata){
                        this.deletefromproject(file);
                        result.Message = "couldn't save images"
                        result.Success = false
                        return result;
                    }
                    result.Message = "images saved successfully"
                    return result;
                }
                catch(e){
                    result.Message = String(e);
                    result.Success = false;
                     this.deletefromproject(file);
            
                }
                return result;
          }

async deletefile(fileid:string , userId:string):Promise<Result<null>>{
       const result = new Result<null>;
                try{
                    const savedata = await this.filerepo.find({where:{id:fileid , UploadedByUserId:userId}});
                    if(savedata== null || savedata.length==0){
                        result.Message = "couldn't find the file"
                        result.Success = false
                        return result;
                    }
                    const deletefile = await this.filerepo.delete({id:fileid});
                    if(!deletefile){
                        result.Message = "couldn't delete the file"
                        result.Success = false
                        return result;
                    }
                    await fs.unlink(savedata[0].Path);
                    result.Message = "file deleted successfully"
                    return result;
                }
                catch(e){
                    result.Message = String(e);
                    result.Success = false;
            
                }
                return result;
          }

    async deletefromproject(data:any[]){
        for(const f of data){
            await fs.unlink(f.path);
        }
    }
    
}
