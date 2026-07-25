import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from '@nestjs/passport';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Roles } from 'src/auth/Role/Roles.decorator';
import { Result } from 'src/SharedServices/Result';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesDto } from './DTO/Files.Dto';
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { menu } from 'src/menu/Entity/menu.entity';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(jwtGuard , RolesGuard)
  @Roles('owner')
  @Delete("DeleteFile/:id")
  Deletefile( @Param("id") id:string , @Req() req:any):Promise<Result<null>>{
    return this.filesService.deletefile(id , req.user.userId);
  }

  @UseGuards(jwtGuard,RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Roles('owner')
  @Post("uploadImages")
  @UseInterceptors(FilesInterceptor('file' , 5 ,{
      storage: diskStorage({
        destination:'./uploads',
        filename: (req , file , cb)=>{
          const filename = Date.now()+"-"+ file.originalname;
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
  async uploadfiles( @UploadedFiles() file: Express.Multer.File[] , @Body() data:FilesDto[] , 
  @Req() req:any):Promise<Result<Resturant | menu>>{
    
    const result = new Result<Resturant | menu>;
    if (!file || file === undefined) {
      result.Message = "NO file was Uploaded";
      result.Success = false;
      return result;
    }
    console.log(file , data);
    
    return await this.filesService.addfiles( file , data , req.user);
  }
}
