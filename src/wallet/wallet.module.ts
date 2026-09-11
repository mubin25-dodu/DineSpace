import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './Entity/wallet.entity';
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { Payment } from 'src/payment/Entity/payment.entity';
import { WithdrawalRequest } from './Entity/WithdrawalRequest.entity';
import { Order } from 'src/order/Entity/Order.entity';
import { WalletTransaction } from './Entity/WalletTransaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletTransaction, Resturant, Payment, WithdrawalRequest, Order])],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
