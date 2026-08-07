import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { varification } from './Entity/verification.entity';
import { UserModule } from 'src/user/user.module';
import { ResturantModule } from 'src/resturant/resturant.module';
import { MailService } from 'src/mail/mail.service';
import { JwtStrategy } from './jwt.stratagy';
import { PassportModule } from '@nestjs/passport';
import { jwtGuard } from './jwtGuard.guard';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from './Role/Roles.Guard';

@Module({
  imports:[
    TypeOrmModule.forFeature([varification]),
    UserModule,
    ResturantModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('secretjwtkey'),
        signOptions: { expiresIn: '1h' }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService , MailService , JwtStrategy , jwtGuard , RolesGuard],
})
export class AuthModule {}
