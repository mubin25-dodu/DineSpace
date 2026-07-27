import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './Entity/payment.entity';
import { Repository } from 'typeorm';
import { Result } from 'src/SharedServices/Result';
import { Tables } from 'src/tables/Entity/Tables.entity';
import { PaymentDto } from './Dto/payment.dto';
import { partialPaymentDto } from './Dto/partialpayment.Dto';
import { randomUUID } from 'crypto';

@Injectable()
export class PaymentService {
    constructor(@InjectRepository(Payment) private readonly paymentrepo:Repository<Payment>){}

    async createPayment(data:PaymentDto):Promise<Result<Payment>> {
            const result = new Result<Payment>();
            try {
                result.Data = await this.paymentrepo.save(data);
                result.Message = "Payment created";
                //send a notification at this pont using websocket
            } catch (e) {
                result.Message = String(e);
                result.Success = false;
            }
                return result;
        }

    // async addorderid(id:string , paymentId:string):Promise<Result<Tables>> {
    //         const result = new Result<Tables>();
    //         try {
    //             const getpayment = await this.paymentrepo.findOne({where:{id:paymentId}});
               
    //            if(getpayment== null){
    //             result.Message = "the payment id could not be found";
    //             result.Success = false;
    //             return result;
    //            } 
    //             getpayment!.orderId = id;
    //             await this.paymentrepo.save(getpayment);
    //             result.Message = "Payment created"
    //         } catch (e) {
    //             result.Message = String(e);
    //             result.Success = false;
    //         }
    //             return result;
    // }
    // async changestatus(data:partialPaymentDto , user:any):Promise<Result<Tables>> {
    //         const result = new Result<Tables>();
    //         try {
    //             if(data.id === undefined || data.status === undefined){
    //             result.Message = "Missing Required id or status field";
    //             result.Success = false;
    //             return result;
    //             }
    //             const getpayment = await this.paymentrepo.findOne({where:{id:data.id}, relations:{order:{
    //                 table:{resturant:true}
    //             }}});
    //             if(getpayment== null){
    //             result.Message = "the payment id could not be found";
    //             result.Success = false;
    //             return result;
    //             } 
    //             if(getpayment.order?.table?.resturant.ownerid !== user.userId || user.userId !=="admin")
    //             {
    //             result.Message = "you do not have permission to perform this task";
    //             result.Success = false;
    //             return result;
    //             }
    //             getpayment.status = data.status;
    //             await this.paymentrepo.save(getpayment);
    //             result.Message = "Status updated"
    //         } catch (e) {
    //             result.Message = String(e);
    //             result.Success = false;
    //         }
    //             return result;
    // }
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
                result.Data = await this.paymentrepo.save(getpayment);
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
}
