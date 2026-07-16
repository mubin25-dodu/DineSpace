import { Body, Controller , Patch, Post, Put } from '@nestjs/common';
import { ResturantService } from './resturant.service';
import { Result } from 'src/SharedServices/Result';
import { ResturantDto } from './DTO/Resturant.Dto';

const userid = "789fe426-45d3-45cf-b621-b5a945aad91c" // usingn it as hard coded now  
@Controller('resturant')
export class ResturantController {
  constructor(private readonly resturantService: ResturantService) {}

  @Post("CreateResturant")
  async Addresturant( @Body() data:ResturantDto):Promise<Result<ResturantDto>>{
    return  await this.resturantService.addresturant(data);
  }

  // @Patch("UpdateResturant")
  // async Updateresturant( @Body() data:ResturantDto):Promise<Result<ResturantDto>>{
  //   // return  await this.resturantService.Updateresturant(data);
  // }

}
