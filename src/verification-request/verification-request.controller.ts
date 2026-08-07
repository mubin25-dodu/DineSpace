import { Controller, Param, Get } from '@nestjs/common';
import { VerificationRequestService } from './verification-request.service';
import { Result } from 'src/SharedServices/Result';
import { users } from 'src/user/Entity/users.entity';

@Controller('verification-request')
export class VerificationRequestController {
  constructor(private readonly verificationRequestService: VerificationRequestService) {}

  @Get("verify/:token")
  verifyToken(@Param("token") token:string):Promise<Result<string | null>>{
    return this.verificationRequestService.verifyToken(token);
  }

}
