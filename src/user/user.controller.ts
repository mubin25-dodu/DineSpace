import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './DTO/User.DTO';
import { PartialUserDto } from './DTO/partialUser.dto';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Roles } from 'src/auth/Role/Roles.decorator';
import { Result } from 'src/SharedServices/Result';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async adduser(@Body() user:UserDto):Promise<Result<UserDto>>{
    return  await this.userService.adduser(user);
  }
  @Get(":data")
  async Findbyemail(@Param("data") email:string ):Promise<Result<PartialUserDto>>{
    return await this.userService.FIndbyemail(email);

  }
  @Post('UpdateEmail')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles('owner')
  async updateEmail(@Body() updateuser:PartialUserDto , @Req() req:any):Promise<Result<PartialUserDto>>{
  return await this.userService.UpdateEmail(req.user,updateuser ) ;
  }
  @Post('UpdatePassword')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles('owner')
  async updatePassword(@Body() updateuser:PartialUserDto , @Req() req:any):Promise<Result<PartialUserDto>>{
  return await this.userService.UpdatePassword(updateuser , req.user ) ;
  }
}
