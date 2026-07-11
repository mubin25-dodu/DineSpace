import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { users } from 'src/Database/Entity/users.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  adduser(@Body() user:users){
    return this.userService.adduser(user);
  }
}
