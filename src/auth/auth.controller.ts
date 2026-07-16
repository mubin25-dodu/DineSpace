import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginPartialDto } from './DTO/PartialLogin.dto';
import { RegistrationDto } from './DTO/Registration.Dto';
import { loginDto } from './DTO/Login.Dto';
import { Result } from 'src/SharedServices/Result';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("Verifyemail")
  async verify(@Query() data: loginPartialDto):Promise<Result<loginPartialDto>>{
    return await this.authService.mailverification(data);
  }

  @Put("register/:uid")
  async registeruser(@Param("uid") uid:string,@Body() registration:RegistrationDto):Promise<Result<RegistrationDto>>{
    return await this.authService.register( uid , registration);
  }

 @Post()
  async login(@Body() data:loginDto):Promise<Result<loginDto>>{
    console.log(data)
    return await this.authService.login(data);
  }    
}
