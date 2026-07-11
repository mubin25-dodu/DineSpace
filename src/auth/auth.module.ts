import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  imports:[
    JwtModule.register({
      secret:"nothingfornow",
      signOptions:{expiresIn:"1m"}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,UserService],
})
export class AuthModule {}
