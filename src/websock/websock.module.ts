import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WebsockGateway } from './websock.gateway';
import { Service } from './websock.service';

@Module({
  imports: [AuthModule],
  providers: [WebsockGateway, Service],
})
export class WebsockModule {}
