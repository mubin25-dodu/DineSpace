import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { menu } from './Entity/menu.entity';
import { Category } from './Entity/category.entity';

@Module({
  imports:[TypeOrmModule.forFeature([menu, Category])],
  controllers: [MenuController],
  providers: [MenuService],
  exports:[MenuService]
})
export class MenuModule {}
 