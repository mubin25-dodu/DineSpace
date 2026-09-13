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
import { RestaurantFileType } from './Enum/files.Enum';

@Injectable()
export class FilesService {
    constructor(@InjectRepository(Files) private readonly filerepo:Repository<Files> ,
    private resturentService:ResturantService,
    private menuService:MenuService){}


async addfiles(
    file: Express.Multer.File[],
    user: any,
    restaurantId?: string,
    menuId?: string,
    restaurantFileType?: RestaurantFileType,
):Promise<Result<Resturant | menu>>{
       const result = new Result<Resturant | menu>;
                try{
                    let restaurantResult;
                    if (restaurantId !== undefined) {
                        restaurantResult = await this.resturentService.FindbyID(restaurantId);
                        if (!restaurantResult.Success || restaurantResult.Data?.ownerid !== user.userId) {
                            result.Success = false;
                            result.Message = "resturant not found check the id Or you are not the owner";
                            this.deletefromproject(file);
                            return result;
                        }
                        if (restaurantFileType === undefined && menuId === undefined) {
                            result.Success = false;
                            result.Message = "Restaurant file type is required";
                            this.deletefromproject(file);
                            return result;
                        }
                        if (restaurantFileType !== undefined && file.length > 1 &&
                            [RestaurantFileType.Logo, RestaurantFileType.Cover].includes(restaurantFileType)) {
                            result.Success = false;
                            result.Message = "Only one logo or cover file can be uploaded at a time";
                            this.deletefromproject(file);
                            return result;
                        }
                    }
                    let menuResult;
                    if (menuId !== undefined) {
                        menuResult = await this.menuService.getbyid(menuId);
                        if (!menuResult.Success || menuResult.Data?.resturent?.ownerid !== user.userId) {
                            result.Success = false;
                            result.Message = "item not found check the id Or you are not the owner";
                            this.deletefromproject(file);
                            return result;
                        }
                    }

                    const previousMenuFiles = menuId !== undefined
                        ? await this.filerepo.find({where: {MenuId: menuId}})
                        : [];
                    

                    const data: Files[] = [];
                    for (const item of file) {
                        const fileData = {
                            FileName: item.filename,
                            OriginalName: item.originalname,
                            Path: item.path,
                            UploadedByUserId: user.userId,
                            Size: item.size,
                            RestaurantId: restaurantResult?.Data?.id ?? restaurantId,
                            restaurantFileType,
                            MenuId: menuId,
                        };
                        const fileEntity = this.filerepo.create(fileData);
                        if (restaurantResult?.Data) {
                            fileEntity.restaurant = restaurantResult.Data;
                            fileEntity.RestaurantId = restaurantResult.Data.id;
                        }
                        data.push(fileEntity);
                    }
            
                                    
                const savedata = await this.filerepo.save(data);
                    if(!savedata){
                        this.deletefromproject(file);
                        result.Message = "couldn't save images"
                        result.Success = false
                        return result;
                    }

                    if (restaurantResult?.Data) {
                        await this.filerepo.update(
                            savedata.map((savedFile) => savedFile.id),
                            { RestaurantId: restaurantResult.Data.id },
                        );
                    }

                    if (restaurantId !== undefined && restaurantFileType !== undefined &&
                        restaurantResult?.Data) {
                        const restaurant = restaurantResult.Data;
                        if (restaurantFileType === RestaurantFileType.Logo) {
                            restaurant.logoFileId = savedata[0].id;
                        } else if (restaurantFileType === RestaurantFileType.Cover) {
                            restaurant.coverFileId = savedata[0].id;
                        }
                        await this.resturentService.save(restaurant);
                    }

                    if (menuId !== undefined && previousMenuFiles.length > 0) {
                        await this.filerepo.softDelete(previousMenuFiles.map((previousFile) => previousFile.id));
                        await this.deleteStoredFiles(previousMenuFiles);
                    }
                    result.Data = restaurantId !== undefined
                        ? (await this.resturentService.FindbyID(restaurantId)).Data
                        : menuResult?.Data;
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
                    const deletefile = await this.filerepo.softDelete({id:fileid});
                    if(!deletefile){
                        result.Message = "couldn't delete the file"
                        result.Success = false
                        return result;
                    }
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
            await fs.unlink(f.path).catch(() => undefined);
        }
    }

    private async deleteStoredFiles(files:Files[]){
        for(const file of files){
            await fs.unlink(file.Path).catch(() => undefined);
        }
    }
    
}
