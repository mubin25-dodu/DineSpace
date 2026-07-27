import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginPartialDto } from './DTO/PartialLogin.dto';
import { RegistrationDto } from './DTO/Registration.Dto';
import { loginDto } from './DTO/Login.Dto';
import { Result } from 'src/SharedServices/Result';
import { jwtGuard } from './jwtGuard.guard';
import { RolesGuard } from './Role/Roles.Guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from './Role/Roles.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("Verifyemail")
  async verify(@Body() data: loginPartialDto):Promise<Result<loginPartialDto>>{
    return await this.authService.mailverification(data);
  }

  @Put("register/:uid")
  async registeruser(@Param("uid") uid:string,@Body() registration:RegistrationDto):Promise<Result<RegistrationDto>>{
    const register = await this.authService.register( uid , registration);
    if(register.Data?.password){
      register.Data.password = "#####"
    }
    return register ;
  }

 @Post("login")
  async login(@Body() data:loginDto): Promise<string | Result<loginDto>> {
    console.log(data)
    return await this.authService.login(data);
  }
  @UseGuards(jwtGuard , RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Roles("owner" , "admin")
  @Get("check")
  check(@Req() data:any){
    console.log("hit");
    return data.user;
  }
}
