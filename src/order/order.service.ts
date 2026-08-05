import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { Order } from './Entity/Order.entity';
import { Result } from 'src/SharedServices/Result';
import { PlaceorderDto } from './Dto/placeOrder.dto';
import { OrderedItems } from './Entity/OrdredItems.entity';
import { PaymentStatus } from 'src/payment/Enum/PaymentStatus.enum';
import { PaymentService } from 'src/payment/payment.service';
import { filterDto } from './Dto/Filterorder.dto';
import { table } from 'console';
import { TablesService } from 'src/tables/tables.service';
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { randomUUID } from 'crypto';
import { Tables } from 'src/tables/Entity/Tables.entity';
import { TableStatus } from 'src/tables/Enum/tablestatus.enum';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Order) private readonly ordrepo:Repository<Order>, 
        @InjectRepository(OrderedItems) private readonly orditemrepo:Repository<OrderedItems>,
        private paymentService:PaymentService ,
        @InjectRepository(Resturant) private readonly resrepo:Repository<Resturant>){}
    
    async getall( id:string , user:any):Promise<Result<Order[]>> {
            const result = new Result<Order[]>();
            try {
                if(user.role == "admin"){
                    const getresturent = await this.ordrepo.find({relations:{table:true} , where:{table:{
                    reservationId:id
                }}});
                
                result.Data = getresturent ?? [];
                result.Message = `${getresturent.length} Orders found`;
                return result;
                }

                const getresturent = await this.ordrepo.find({relations:{orderitems:true} , where:{table:{
                    resturantid:id , orderId:user.userId
                }}});
               result.Data = getresturent ?? [];
               result.Message = `${getresturent.length} Orders found`;
            } catch (e) {
                result.Message = String(e);
                result.Success = false;
            }
               return result;
    }

    async filterOrders( data:filterDto , user:any):Promise<Result<Order[]>> {
            const result = new Result<Order[]>();
            try {
                if(user.role == "admin"){
                    const getresturent = await this.ordrepo.find({
                        where:[{table:{resturantid:data.ResturentId}},
                            {payment:{status:data.paymentstatus}},
                            {OrderstStatus:data.Status}
                        ]
                    });
                
                result.Data = getresturent ?? [];
                result.Message = `${getresturent.length} Orders found`;
                return result;
                }

               const getresturent = await this.ordrepo.find({
                        where:[{table:{resturantid:data.ResturentId , resturant:{ownerid:user.userId}}},
                            {payment:{status:data.paymentstatus}},
                            {OrderstStatus:data.Status}
                        ]
                    });
               result.Data = getresturent ?? [];
               result.Message = `${getresturent.length} Orders found`;
            } catch (e) {
                result.Message = String(e);
                result.Success = false;
            }
               return result;
    }

    async makeOrder(data:PlaceorderDto):Promise<Result<Order>> {
            const result = new Result<Order>();
            try {
              const orderId = randomUUID();
              data.payment.orderId = orderId;
              data.orderdetails.id  = orderId;
              const getresturent = await this.resrepo.findOne({where:{tables:{id:data.orderdetails.tableId} }, relations:{menu:true , tables:true}})
              
            //   console.log(getresturent?.tables);
              if(getresturent === null){
                result.Message = "no resturent or table found"
                result.Success = false;
                return result;
              }
               
              const table = getresturent.tables?.[0];

               if(table?.status !== TableStatus.Isavailable){
                result.Message == `The table ${table?.status}`;
                result.Success = false ;
                return result;
               }

              if(getresturent.payfirst == true && data.payment.status !== PaymentStatus.Paid){
                result.Message = "Pay first"
                result.Success = false;
                return result;
              }
              if( data.payment.transectionId == undefined || data.payment.acountNumber == undefined ){
                result.Message = "Enter the payment details";
                result.Success = false;
                return result;
              }

            //   refactoring the order prices
            data.orderdetails.payable = 0;
            for(let i = 0 ; i < data.orderitems.length ; i++){
                for(let j = 0 ; j < getresturent.menu!.length ; j++){
                    if(data.orderitems[i].itemId === getresturent.menu![j].id){
                        const itemPrice = Number(getresturent.menu![j].price);
                        const price = data.orderitems[i].quantity * itemPrice;
                        data.orderitems[i].price = price;
                        data.orderdetails.payable+=price;
                        }
                    }
                    data.orderitems[i].orderId = orderId;
                }
             const saveorder = await this.ordrepo.save(data.orderdetails);  
             
             const saveorderitems = await this.orditemrepo.save(data.orderitems);
             const payment = await  this.paymentService.createPayment(data.payment);
             if(!payment.Success){
                result.Message = payment.Message;
                result.Success = false;
                return result;
             }
             result.Data = saveorder ;
             result.Message = "Order saved ";
            } catch (e) {
                result.Message = String(e);
                result.Success = false;
            }
               return result;
    }
}
