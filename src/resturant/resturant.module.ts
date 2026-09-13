import { Module } from '@nestjs/common';
import { ResturantService } from './resturant.service';
import { ResturantController } from './resturant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resturant } from './Entity/Resturant.entity';
import { WalletModule } from 'src/wallet/wallet.module';
import { Order } from 'src/order/Entity/Order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resturant, Order]), WalletModule],
  controllers: [ResturantController],
  providers: [ResturantService],
  exports: [ResturantService],
})
export class ResturantModule {}
