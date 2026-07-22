import { Body, Controller , Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ResturantService } from './resturant.service';
import { Result } from 'src/SharedServices/Result';
import { ResturantDto } from './DTO/Resturant.Dto';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Roles } from 'src/auth/Role/Roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

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

}
