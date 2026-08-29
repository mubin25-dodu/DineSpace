import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './Entity/wallet.entity';
import { Repository } from 'typeorm';
import { Result } from 'src/SharedServices/Result';
import { WalletDto } from './Dto/wallet.dto';
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { Payment } from 'src/payment/Entity/payment.entity';
import { WithdrawalRequest } from './Entity/WithdrawalRequest.entity';

@Injectable()
export class WalletService {
    constructor (
        @InjectRepository(Wallet) private readonly walletrepo:Repository<Wallet>,
        @InjectRepository(Resturant) private readonly restaurantrepo:Repository<Resturant>,
        @InjectRepository(Payment) private readonly paymentrepo:Repository<Payment>,
        @InjectRepository(WithdrawalRequest) private readonly withdrawalRequestrepo:Repository<WithdrawalRequest>,
    ){}


    async addtowallet(data:WalletDto, payment?:Payment): Promise<Result<Wallet>> {
        const result = new Result<Wallet>();
        try{
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

    async getall(resid:string , userId:string): Promise<Result<Wallet>> {
        const result = new Result<Wallet>();
        try{
            const resowner = await this.restaurantrepo.findOne({where:{id:resid , ownerid:userId}});
            if(resowner == null){
                result.Message = "Couldent Find the Resturent Under Your Name";
                result.Success = false;
                return result;
            }
            const wallet = await this.walletrepo.findOne({where:{restaurantId:resid}});
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
}