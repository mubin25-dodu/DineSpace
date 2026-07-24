import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ResturantModule } from './resturant/resturant.module';
import { MailModule } from './mail/mail.module';
import { VerificationRequestModule } from './verification-request/verification-request.module';
import { FilesModule } from './files/files.module';
import { MenuModule } from './menu/menu.module';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    expandVariables:true,
    envFilePath:'.env'
  }),AuthModule, TypeOrmModule.forRoot({
    type:'postgres',
    host: process.env.DBHost ?? 'localhost',
    port: Number(process.env.DBport ?? 5432),
    username: process.env.DBusername,
    password: process.env.DBpassword,
    database: process.env.database,
    ssl:{rejectUnauthorized: false} ,
    extra: { rejectUnauthorized: false },
    autoLoadEntities:true,
    synchronize:true
  }), UserModule, ResturantModule, MailModule, VerificationRequestModule, FilesModule, MenuModule, TablesModule],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
