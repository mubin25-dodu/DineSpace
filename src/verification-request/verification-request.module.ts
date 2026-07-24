import { Module, forwardRef } from '@nestjs/common';
import { VerificationRequestService } from './verification-request.service';
import { VerificationRequestController } from './verification-request.controller';
import { MailService } from 'src/mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationRequest } from './entity/VerificationRequest.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationRequest]), forwardRef(() => UserModule)],
  controllers: [VerificationRequestController],
  providers: [VerificationRequestService , MailService ],
  exports:[VerificationRequestService]
})
export class VerificationRequestModule {}
