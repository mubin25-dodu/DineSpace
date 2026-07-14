import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ResturantModule } from './resturant/resturant.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    expandVariables:true
  }),AuthModule, TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'postgres',
    password:'mubindb',
    database:'DineSpaceDB',
    autoLoadEntities:true,
    synchronize:true
  }), UserModule, ResturantModule, MailModule],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
