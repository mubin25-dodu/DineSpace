import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './Entity/wallet.entity';
import { Repository } from 'typeorm';
import { Result } from 'src/SharedServices/Result';
import { WalletDto } from './Dto/wallet.dto';
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { Payment } from 'src/payment/Entity/payment.entity';
import { WithdrawalRequest } from './Entity/WithdrawalRequest.entity';
import { PaymentStatus } from 'src/payment/Enum/PaymentStatus.enum';
import { Order } from 'src/order/Entity/Order.entity';
import { WithdrawalStatus } from './Enum/WithdrawalStatus.enum';
import { WithdrawalType } from './Enum/WithdrawalType.enum';
import { OrderStatus } from 'src/order/enum/OrderStatus.enum';
import { EntityManager } from 'typeorm';
import { WalletTransaction } from './Entity/WalletTransaction.entity';

@Injectable()
export class WalletService {
    constructor (
        @InjectRepository(Wallet) private readonly walletrepo:Repository<Wallet>,
        @InjectRepository(Resturant) private readonly restaurantrepo:Repository<Resturant>,
        @InjectRepository(Payment) private readonly paymentrepo:Repository<Payment>,
        @InjectRepository(WithdrawalRequest) private readonly withdrawalRequestrepo:Repository<WithdrawalRequest>,
        @InjectRepository(Order) private readonly orderrepo:Repository<Order>,
    ){}


    async addtowallet(data:WalletDto, payment?:Payment): Promise<Result<Wallet>> {
        const result = new Result<Wallet>();
        try{
            if (payment && payment.status !== PaymentStatus.Paid) {
                result.Success = false;
                result.Message = "Payment has not been successful yet. Wallet was not credited.";
                return result;
            }

            const getresturent = await this.restaurantrepo.findOne({where:{id:data.restaurantId}});
            if(getresturent == null){
                result.Success = false;
                result.Message = "Resturant not Found";
                return result;
            }
            const getwallet = await this.walletrepo.findOne({where:{restaurantId:data.restaurantId}});
            let wallet: Wallet;
            if(getwallet !== null){
                getwallet.balance = Number(getwallet.balance) + Number(data.balance);
                wallet = await this.walletrepo.save(getwallet);
            } else {
                wallet = await this.walletrepo.save({
                    restaurantId: data.restaurantId,
                    balance: data.balance,
                });
            }

            if (payment) {
                payment.walletId = wallet.id;
                payment.wallet = wallet;
                await this.paymentrepo.save(payment);
            }

            result.Data = wallet;
            result.Message = "Added to wallet";
            return result;
        }catch(e){
            result.Success = false;
            result.Message = String(e);
            return result;
        }
    }

    async creditWallet(
        manager:EntityManager,
        restaurantId:string,
        amount:number,
        payment:Payment,
    ):Promise<Wallet> {
        const walletRepo = manager.getRepository(Wallet);
        const transactionRepo = manager.getRepository(WalletTransaction);
        const restaurant = await manager.getRepository(Resturant).findOne({
            where: { id: restaurantId },
        });
        if (!restaurant) {
            throw new Error("Resturant not Found");
        }
        const existingCredit = await transactionRepo.findOne({
            where: { paymentId: payment.id },
        });
        if (existingCredit) {
            return walletRepo.findOneByOrFail({ id: existingCredit.walletId });
        }
        let wallet = await walletRepo.findOne({
            where: { restaurantId },
            lock: { mode: "pessimistic_write" },
        });
        if (!wallet) {
            wallet = walletRepo.create({ restaurantId, balance: 0 });
        }
        wallet.balance = Number(wallet.balance) + amount;
        wallet = await walletRepo.save(wallet);
        await transactionRepo.save(transactionRepo.create({
            walletId: wallet.id,
            paymentId: payment.id,
            amount,
            wallet,
            payment,
        }));
        payment.walletId = wallet.id;
        await manager.getRepository(Payment).save(payment);
        return wallet;
    }

    async getall(resid:string , userId:string): Promise<Result<Wallet>> {
        const result = new Result<Wallet>();
        try{
            const resowner = await this.restaurantrepo.findOne({where:{id:resid , ownerid:userId}});
            if(resowner == null){
                result.Message = "Couldent Find the Resturent Under Your Name";
                result.Success = false;
                return result;
            }
            const wallet = await this.walletrepo.findOne({where:{restaurantId:resid} , relations:{withdrawalRequests:true}});
            if(wallet == null){
                result.Message = "Wallet not found";
                result.Success = false;
                return result;
            }
            result.Data = wallet;
            return result;
            
        }catch(e){
            result.Success = false;
            result.Message = String(e);
            return result;
        }
    }

    async applywidthdraw (resturentId , userId , data): Promise<Result<WithdrawalRequest>>{
        const result = new Result<WithdrawalRequest>();
        try{
            const resowner = await this.restaurantrepo.findOne({where:{id:resturentId , ownerid:userId}});
            if(resowner == null){
                result.Message = "Couldent Find the Resturent Under Your Name";
                result.Success = false;
                return result;
            }
            const getwallet = await this.walletrepo.findOne({where:{restaurantId:resturentId}});
            if(getwallet == null){
                result.Message = "Wallet not found";
                result.Success = false;
                return result;
            }
            else if(getwallet.balance < data.amount){
                result.Message = "Insufficient balance for withdrawal";
                result.Success = false;
                return result;
            }
            data.walletId = getwallet.id;
            await this.withdrawalRequestrepo.save(data);
            return result;
            
        }catch(e){
            result.Success = false;
            result.Message = String(e);
            return result;
        }
    }

    async cancelWithdrawal(withdrawalId:string, userId:string):Promise<Result<WithdrawalRequest>> {
        const result = new Result<WithdrawalRequest>();
        try {
            const withdrawal = await this.withdrawalRequestrepo.findOne({
                where: { id: withdrawalId },
                relations: { wallet: { restaurant: true } },
            });
            if (!withdrawal) {
                result.Success = false;
                result.Message = "Withdrawal request not found";
                return result;
            }

            if (withdrawal.wallet.restaurant.ownerid !== userId) {
                result.Success = false;
                result.Message = "You do not have permission to cancel this withdrawal request";
                return result;
            }

            if (withdrawal.status !== WithdrawalStatus.Pending) {
                result.Success = false;
                result.Message = "Only pending withdrawal requests can be canceled";
                return result;
            }
            withdrawal.status = WithdrawalStatus.Cancled;
            await this.withdrawalRequestrepo.save(withdrawal);
            result.Data = withdrawal;
            result.Message = "Withdrawal request canceled";
        } catch (e) {
            result.Success = false;
            result.Message = String(e);
        }
        return result;
    }

    async refundOrder(orderId: string, user: any): Promise<Result<WithdrawalRequest>> {
        const result = new Result<WithdrawalRequest>();
        try {
            const order = await this.orderrepo.findOne({
                where: { id: orderId },
                relations: { payment: true, table: { resturant: true } },
            });

            if (!order || !order.payment || !order.table?.resturant) {
                result.Success = false;
                result.Message = 'Order or payment not found';
                return result;
            }

            if (user.role !== 'admin' && order.table.resturant.ownerid !== user.userId) {
                result.Success = false;
                result.Message = 'You do not have permission to refund this order';
                return result;
            }

            if (order.payment.status === PaymentStatus.Refund) {
                result.Success = false;
                result.Message = 'This order has already been refunded';
                return result;
            }

            if (order.payment.status !== PaymentStatus.Paid) {
                result.Success = false;
                result.Message = 'Only paid orders can be refunded';
                return result;
            }

            const amount = Number(order.payment.amount);
            if (!Number.isFinite(amount) || amount <= 0) {
                result.Success = false;
                result.Message = 'The order has an invalid refund amount';
                return result;
            }

            const payment = order.payment;
            const refund = await this.walletrepo.manager.transaction(async (manager) => {
                const walletRepository = manager.getRepository(Wallet);
                const paymentRepository = manager.getRepository(Payment);
                const orderRepository = manager.getRepository(Order);
                const withdrawalRepository = manager.getRepository(WithdrawalRequest);
                const wallet = await walletRepository.findOne({
                    where: { restaurantId: order.table!.resturantid },
                });

                if (!wallet) {
                    throw new Error('Wallet not found');
                }
                if (Number(wallet.balance) < amount) {
                    throw new Error('Insufficient balance for refund');
                }

                wallet.balance = Number(wallet.balance) - amount;
                await walletRepository.save(wallet);

                payment.status = PaymentStatus.Refund;
                await paymentRepository.save(payment);

                order.OrderStatus = OrderStatus.Cancled;
                await orderRepository.save(order);

                return withdrawalRepository.save({
                    walletId: wallet.id,
                    amount,
                    type: WithdrawalType.Refund,
                    status: WithdrawalStatus.Approved,
                    paymentMethod: payment.paymentMethode,
                    accountNumber: String(payment.acountNumber ?? ''),
                    processedAt: new Date(),
                });
            });

            result.Data = refund;
            result.Message = 'Refund issued successfully';
            return result;
        } catch (e) {
            result.Success = false;
            result.Message = String(e).replace(/^Error: /, '');
            return result;
        }
    }
}