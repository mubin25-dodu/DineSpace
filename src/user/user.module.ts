import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { users } from './Entity/users.entity';

@Module({
  imports:[TypeOrmModule.forFeature([users])],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
