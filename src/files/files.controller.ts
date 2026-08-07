import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Roles } from 'src/auth/Role/Roles.decorator';
import { Result } from 'src/SharedServices/Result';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { menu } from 'src/menu/Entity/menu.entity';
import { Admin } from 'typeorm/driver/mongodb/typings.js';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(jwtGuard , RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Roles('owner' , "admin")
  @Delete("DeleteFile/:id")
  Deletefile( @Param("id") id:string , @Req() req:any):Promise<Result<null>>{
    return this.filesService.deletefile(id , req.user.userId);
  }

  @UseGuards(jwtGuard,RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Roles('owner' , "admin")
  @Post("uploadImages")
  @UseInterceptors(FilesInterceptor('file' , 5 ,{
      storage: diskStorage({
        destination:'./uploads',
        filename: (req , file , cb)=>{
          const filename = "DineSpace"+Date.now()+"-"+ file.originalname;
          cb( null , filename);
        }
      }),
      fileFilter:(res, file , cb)=>{
        if(file.originalname.match(/^.*\.(jpg|jpeg|png)$/))
        {
          cb(null , true);
        }else{
          cb( new BadRequestException("Only Images with extention 'jpg' , 'jpeg' and 'png' are acceptable ") , false)
        }
      },
      limits:{
        fileSize:  3 * 1024 * 1024
      }
  }))
  async uploadfiles( @UploadedFiles() file: Express.Multer.File[] , @Req() req:any , @Query('resturantId') resturenId?:string, @Query('menuId') menuId?:string ,
  ):Promise<Result<Resturant | menu>>{
    
    const result = new Result<Resturant | menu>;
    if (!file || file === undefined) {
      result.Message = "NO file was Uploaded";
      result.Success = false;
      return result;
    }
    // console.log(file);
    
    return await this.filesService.addfiles( file , req.user , resturenId , menuId);
  }
}
