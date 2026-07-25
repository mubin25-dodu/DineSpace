import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MenuService } from './menu.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/Role/Roles.decorator';
import { menu } from './Entity/menu.entity';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Result } from 'src/SharedServices/Result';
import { MenuDto } from './Dto/menu.Dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

    @ApiBearerAuth('bearerAuth')
    @UseGuards(jwtGuard, RolesGuard)
    @Roles('owner')
    @Post("CreateMenu")
    async createmenu(@Body() menu:MenuDto[] , @Req() req:any):Promise<Result<menu[]>>{
      const createmenu =  await this.menuService.createMenu(menu, req.user);
      return createmenu;
    }
    @ApiBearerAuth('bearerAuth')
    @UseGuards(jwtGuard, RolesGuard)
    @Roles('owner')
    @Patch("UpdateMenu")
    async updateMenu(@Body() menu:menu[] , @Req() req:any):Promise<Result<menu[]>>{
      const createmenu =  await this.menuService.updateMenu(menu, req.user);
      return createmenu;
    }
    
    @ApiBearerAuth('bearerAuth')
    @UseGuards(jwtGuard, RolesGuard)
    @Roles('owner')
    @Delete("DeleteMenuItem/:id")
    async deleteitem(@Param("id") id:string , @Req() req:any):Promise<Result<menu>>{
      const createmenu =  await this.menuService.deleteitem(id, req.user);
      return createmenu;
    }

    @Get("GetMenu/:Resturentid")
    async Getall(@Param("Resturentid") Resturentid:string ):Promise<Result<menu[]>>{
      const createmenu =  await this.menuService.getall(Resturentid);
      return createmenu;
    }

    @ApiBearerAuth('bearerAuth')
    @UseGuards(jwtGuard, RolesGuard)
    @Roles('owner')
    @Get("toggleAvailabel/:itemid")
    async Isavailable(@Param("itemid") itemid:string , @Req()req:any ):Promise<Result<menu>>{
      const createmenu =  await this.menuService.Isavailable(itemid , req.user);
      return createmenu;
    }
}
