import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Files } from './Entity/Files.Entity';
import { Repository } from 'typeorm';
import { FilesDto } from './DTO/Files.Dto';
import { Result } from 'src/SharedServices/Result';
import fs from 'fs/promises'
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { menu } from 'src/menu/Entity/menu.entity';

@Injectable()
export class FilesService {
    constructor(@InjectRepository(Files) private readonly filerepo:Repository<Files>){}


async addfiles( file: Express.Multer.File[],data:FilesDto[] , user:any ):Promise<Result<Resturant | menu>>{
       const result = new Result<Resturant | menu>;
                try{

                   if(file.length>1){
                     for(let i = 0 ; i<file.length ; i++){
                        data[i].FileName = file[i].fieldname;
                        data[i].OriginalName = file[i].originalname;
                        data[i].Path = file[i].path;
                        data[i].UploadedByUserId = user.userId;
                        data[i].Size = file[i].size;
                        }
                    }
                                    
                const savedata = await this.filerepo.save(data);
                    if(!savedata){
                        // dleting the files if not saved
                        for(const f of data){
                            await fs.unlink(f.Path);
                        }
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
                        // dleting the files if not saved
                     for(const f of file){
                            await fs.unlink(f.path);
                        }
            
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
    
}
