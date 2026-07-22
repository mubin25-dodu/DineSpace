import { BadRequestException, Body, Controller , Get, Param, ParseFilePipeBuilder, Patch, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ResturantService } from './resturant.service';
import { Result } from 'src/SharedServices/Result';
import { ResturantDto } from './DTO/Resturant.Dto';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Roles } from 'src/auth/Role/Roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileEnum } from 'src/files/Enum/files.Enum';
import { Resturant } from './Entity/Resturant.entity';

@Controller('resturant')

export class ResturantController {
  constructor(private readonly resturantService: ResturantService) {} 
  @ApiBearerAuth('bearerAuth')
  @Roles('owner')
  @Post("CreateResturant")
  async Addresturant( @Body() data:ResturantDto):Promise<Result<ResturantDto>>{
    return  await this.resturantService.addresturant(data);
  }

  @UseGuards(jwtGuard,RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Roles('owner')
  @Patch("UpdateEmail")
  async Updateresturant( @Req() req:any , @Body() data:ResturantDto):Promise<Result<ResturantDto>>{
    return  await this.resturantService.Updateresturant(req.user,data);
  }

  //anyone can search with term(name email phone address)
  @Get("searchResturants/:term")
  search(@Param("term") term:string):Promise<Result<ResturantDto[]>>{
    return this.resturantService.search(term);
  }


  @UseGuards(jwtGuard,RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Roles('owner')
  @Put("uploadImages/:id")
  @UseInterceptors(FilesInterceptor('file' , 2 ,{
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
  async uploadfiles( @UploadedFiles() file: Express.Multer.File[] , @Param() id:string , 
  @Req() req:any):Promise<Result<Resturant | null>>{

    const result = new Result<Resturant|null>;
    if (!file || file === undefined) {
      result.Message = "NO file was Uploaded";
      result.Success = false;
      return result;
    }
    console.log(file , id);
    
    return await this.resturantService.Uploadfiles(file , id , fileEnum.Resturant , req.user.userId);
  }

}
