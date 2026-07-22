import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from '@nestjs/passport';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Roles } from 'src/auth/Role/Roles.decorator';
import { Result } from 'src/SharedServices/Result';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(jwtGuard , RolesGuard)
  @Roles('owner')
  @Get("DeleteFile/:id")
  Deletefile( @Param("id") id:string , @Req() req:any):Promise<Result<null>>{
    return this.filesService.deletefile(id , req.user.userId);
  }
}
