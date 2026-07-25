import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { menu } from './Entity/menu.entity';
import { ResturantModule } from 'src/resturant/resturant.module';

@Module({
  imports:[TypeOrmModule.forFeature([menu]  ),ResturantModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
 