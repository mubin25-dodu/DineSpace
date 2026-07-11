import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginPartialDto } from './DTO/PartialLogin.dto';
import { RegistrationDto } from './DTO/Registration.Dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("Verifyemail")
  verify(@Query() data: loginPartialDto){
    return this.authService.mailverification(data);
  }

  @Put("register/:uid")
  registeruser(@Param("uid") uid:string,@Body() registration:RegistrationDto){
    console.log("uid",uid);
    console.log("registration",registration);
    return this.authService.register( uid , registration);
  }

 @Post()
  login(@Param('name') name:string , @Param('pass') pass:string){
    return this.authService.login(name,pass);

  }
    
}
