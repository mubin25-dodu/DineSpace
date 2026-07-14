import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ResturantService } from 'src/resturant/resturant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { varification } from './Entity/verification.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([varification]),
    JwtModule.register({
      secret:"nothingfornow",
      signOptions:{expiresIn:"1H"}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,UserService ,ResturantService],
})
export class AuthModule {}
