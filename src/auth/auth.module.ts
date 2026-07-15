import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { varification } from './Entity/verification.entity';
import { UserModule } from 'src/user/user.module';
import { ResturantModule } from 'src/resturant/resturant.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([varification]),
    UserModule,
    ResturantModule,
    JwtModule.register({
      secret:"nothingfornow",
      signOptions:{expiresIn:"1H"}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
