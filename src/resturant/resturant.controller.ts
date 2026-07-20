import { Body, Controller , Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ResturantService } from './resturant.service';
import { Result } from 'src/SharedServices/Result';
import { ResturantDto } from './DTO/Resturant.Dto';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Roles } from 'src/auth/Role/Roles.decorator';


@Controller('resturant')
@UseGuards(jwtGuard,RolesGuard)
@Roles('owner')
export class ResturantController {
  constructor(private readonly resturantService: ResturantService) {}


  @Post("CreateResturant")
  async Addresturant( @Body() data:ResturantDto):Promise<Result<ResturantDto>>{
    return  await this.resturantService.addresturant(data);
  }

  @Patch("UpdateEmail")
  async Updateresturant( @Req() req:any , @Body() data:ResturantDto):Promise<Result<ResturantDto>>{
    return  await this.resturantService.Updateresturant(req.user,data);
  }

}
