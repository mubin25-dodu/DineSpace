import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { users } from './Entity/users.entity';
import { VerificationRequestModule } from 'src/verification-request/verification-request.module';

@Module({
  imports:[TypeOrmModule.forFeature([users]), forwardRef(() => VerificationRequestModule)],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
