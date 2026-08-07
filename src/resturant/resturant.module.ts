import { Module } from '@nestjs/common';
import { ResturantService } from './resturant.service';
import { ResturantController } from './resturant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resturant } from './Entity/Resturant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resturant])],
  controllers: [ResturantController],
  providers: [ResturantService],
  exports: [ResturantService],
})
export class ResturantModule {}
