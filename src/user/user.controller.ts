import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './DTO/User.DTO';
import { PartialUserDto } from './DTO/partialUser.dto';
import { users } from './Entity/users.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async adduser(@Body() user:UserDto){
    return  await this.userService.adduser(user);
  }
  @Get(":data")
  async Findbyemail(@Param("data") data:PartialUserDto ){
    return await this.userService.FIndbyemail(data.email);

  }
}
