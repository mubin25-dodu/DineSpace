import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tables } from './Entity/Tables.entity';
import { ResturantModule } from 'src/resturant/resturant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tables]), ResturantModule],
  controllers: [TablesController],
  providers: [TablesService],
})
export class TablesModule {}
