import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './Entity/Order.entity';
import { AddOnOrder } from './Entity/AddOnOrder.entity';
import { OrderedItems } from './Entity/OrdredItems.entity';
import { PaymentModule } from 'src/payment/payment.module';
import { TablesModule } from 'src/tables/tables.module';
import { Tables } from 'src/tables/Entity/Tables.entity';
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { WalletModule } from 'src/wallet/wallet.module';
import { MailModule } from 'src/mail/mail.module';
import { WebsockModule } from 'src/websock/websock.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, AddOnOrder, OrderedItems, Resturant, Tables]), PaymentModule, WalletModule, MailModule , WebsockModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
