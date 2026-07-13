import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { users } from 'src/Database/Entity/users.entity';
import { UserDto } from './DTO/User.DTO';
import { PartialUserDto } from './DTO/partialUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async adduser(@Body() user:users){
    return  await this.userService.adduser(user);
  }
  @Get(":data")
  async Findbyemail(@Param("data") data:PartialUserDto ){
    return await this.userService.FIndbyemail(data.email);

  }
}
