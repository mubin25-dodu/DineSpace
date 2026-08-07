import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './Entity/Order.entity';
import { OrderedItems } from './Entity/OrdredItems.entity';
import { PaymentModule } from 'src/payment/payment.module';
import { TablesModule } from 'src/tables/tables.module';
import { Resturant } from 'src/resturant/Entity/Resturant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderedItems , Resturant]), PaymentModule ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
