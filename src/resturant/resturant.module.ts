import { Module } from '@nestjs/common';
import { ResturantService } from './resturant.service';
import { ResturantController } from './resturant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resturant } from './Entity/Resturant.entity';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resturant]), FilesModule],
  controllers: [ResturantController],
  providers: [ResturantService],
  exports: [ResturantService],
})
export class ResturantModule {}
