import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './Entity/payment.entity';
import { Between, Repository } from 'typeorm';
import { Result } from 'src/SharedServices/Result';
import { PaymentDto } from './Dto/payment.dto';
import { partialPaymentDto } from './Dto/partialpayment.Dto';
import { PaymentStatus } from './Enum/PaymentStatus.enum';
import { paymentMethod } from './Enum/PaymentMethode.enum';

@Injectable()
export class PaymentService {
    constructor(@InjectRepository(Payment) private readonly paymentrepo:Repository<Payment>){}

    async createPayment(data:PaymentDto):Promise<Result<Payment>> {
            const result = new Result<Payment>();
            try {
                // data.paymentMethode !== paymentMethod.Cash;
                result.Data = await this.paymentrepo.save(data);
                result.Message = "Payment created";
                //send a notification at this pont using websocket
            } catch (e) {
                result.Message = String(e);
                result.Success = false;
            }
                return result;
        }

    async updateinfo(data:partialPaymentDto , user:any):Promise<Result<Payment>> {
            const result = new Result<Payment>();
            try {
                if(data.id === undefined){
                result.Message = "Missing id Required";
                result.Success = false;
                return result;
                }
                const getpayment = await this.paymentrepo.findOne({where:{id:data.id}, relations:{order:{
                    table:{resturant:true}
                }}});
                if(getpayment== null){
                result.Message = "the payment id could not be found";
                result.Success = false;
                return result;
                } 
                if(getpayment.order?.table?.resturant.ownerid !== user.userId && user.role !=="admin")
                {
                result.Message = "you do not have permission to perform this task";
                result.Success = false;
                return result;
                }
                result.Data = await this.paymentrepo.save(data);
                result.Message = "Payment updated"
            } catch (e) {
                result.Message = String(e);
                result.Success = false;
            }
                return result;
    }
    async getallByResturent(resturentId:string , user:any):Promise<Result<Payment[]>> {
            const result = new Result<Payment[]>();
            try {

                //give the  data to the admin directly
                if(user.role !=="admin" ){
                const getpayment = await this.paymentrepo.find({where:{order:{table:{resturantid:resturentId}}}});
                result.Data = getpayment;
                result.Message = `${getpayment.length} payment history found`;
                return result;
                }

                //validating if the user is the owner 
                const getpayment = await this.paymentrepo.find({where:{order:{table:{resturantid:resturentId , resturant:{ownerid:user.userId}}}}});
                if(getpayment== null){
                result.Message = "the Resturent not found";
                result.Success = false;
                return result;
                } 
                result.Data = getpayment;
                result.Message = `${getpayment.length} payment history found`
            } catch (e) {
                result.Message = String(e);
                result.Success = false;
            }
                return result;
        }

    async getMonthlyPayments(resturentId:string, month:string, year:string, user:any):Promise<Result<Payment[]>> {
            const result = new Result<Payment[]>();
            const monthNumber = Number(month);
            const yearNumber = Number(year);

            if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12 ||
                !Number.isInteger(yearNumber) || yearNumber < 1) {
                result.Success = false;
                result.Message = "Month must be between 1 and 12 and year must be a positive integer";
                return result;
            }

            try {
                const startDate = new Date(yearNumber, monthNumber - 1, 1);
                const endDate = new Date(yearNumber, monthNumber, 1);
                const restaurantWhere = user.role === "admin"
                    ? { resturantid: resturentId }
                    : { resturantid: resturentId, resturant: { ownerid: user.userId } };
                const payments = await this.paymentrepo.find({
                    where: {
                        createdat: Between(startDate, endDate),
                        order: { table: restaurantWhere },
                    },
                    order: { createdat: "ASC" },
                });

                result.Data = payments;
                result.Message = `${payments.length} payment history found`;
            } catch (e) {
                result.Message = String(e);
                result.Success = false;
            }
            return result;
    }

    async makepayment(data:PaymentDto):Promise<Result<Payment>>{
        const result = new Result<Payment>();
            try {
                const amount = Number(data?.amount);

                if (!data || !Number.isFinite(amount) || amount <= 0) {
                    result.Success = false;
                    result.Message = "Invalid payment amount. Payment amount must be a positive number.";
                    return result;
                }

                //mimicing the payment process here
                if(Math.random() < 0.1){
                    result.Success = false;
                    result.Message = "Demo Transection failed";
                    return result;
                }

                const fakepayment = new Payment();
                fakepayment.transectionId = `Fake-${Math.random()}`;
                fakepayment.status = PaymentStatus.Paid;
                fakepayment.paymentMethode = data.paymentMethode;
                fakepayment.orderId = data.orderId;
                fakepayment.amount = Number(amount.toFixed(2));
                // this.paymentrepo.save(fakepayment);
                result.Data = fakepayment;
                result.Message = 'Payment processed';
            } catch (e) {
                result.Message = String(e);
                result.Success = false;
            }
                return result;
    }
}
