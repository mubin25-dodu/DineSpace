import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { varification } from 'src/auth/Entity/verification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/Entity/Order.entity';
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { menu } from 'src/menu/Entity/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Resturant , menu])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
