import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { Files } from './Entity/Files.Entity';
import { ResturantModule } from 'src/resturant/resturant.module';
import { MenuModule } from 'src/menu/menu.module';

@Module({
  imports: [TypeOrmModule.forFeature([Files]), ResturantModule, MenuModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService ],
})
export class FilesModule {}
