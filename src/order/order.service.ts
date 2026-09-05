import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { Order } from './Entity/Order.entity';
import { Result } from 'src/SharedServices/Result';
import { PlaceorderDto } from './Dto/placeOrder.dto';
import { OrderedItems } from './Entity/OrdredItems.entity';
import { PaymentStatus } from 'src/payment/Enum/PaymentStatus.enum';
import { PaymentService } from 'src/payment/payment.service';
import { filterDto } from './Dto/Filterorder.dto';
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { randomInt, randomUUID } from 'crypto';
import { TableStatus } from 'src/tables/Enum/tablestatus.enum';
import { Tables } from 'src/tables/Entity/Tables.entity';
import { paymentMethod } from 'src/payment/Enum/PaymentMethode.enum';
import { OrderStatus } from './enum/OrderStatus.enum';
import { UpdateOrderDto } from './Dto/UpdateOrder';
import { WalletService } from 'src/wallet/wallet.service';
import { WithdrawalRequest } from 'src/wallet/Entity/WithdrawalRequest.entity';
import { WithdrawalRequestDto } from 'src/wallet/Dto/WithdrawalRequest.dto';
import { WithdrawalType } from 'src/wallet/Enum/WithdrawalType.enum';
import { AddOnOrder } from './Entity/AddOnOrder.entity';
import { AddOnOrderDto } from './Dto/AddOnOrder.dto';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Order) private readonly ordrepo:Repository<Order>,         @InjectRepository(AddOnOrder) private readonly addOnOrderRepo:Repository<AddOnOrder>,        @InjectRepository(OrderedItems) private readonly orditemrepo:Repository<OrderedItems>,
        @InjectRepository(Tables) private readonly tablerepo:Repository<Tables>,
        private paymentService:PaymentService ,
        private walletService:WalletService,
        @InjectRepository(Resturant) private readonly resrepo:Repository<Resturant>){}
    
    async getall( id:string , user:any):Promise<Result<Order[]>> {
            const result = new Result<Order[]>();
            try {
                if(user.role == "admin"){
                    const getresturent = await this.ordrepo.find({ relations: { orderitems: {menu:true} , table:true , payment:true , addOnOrders:{payment:true , addOnOrderItems:{menu:true}} }, where:{table:{
                    reservationId:id
                }}});
                
                result.Data = getresturent ?? [];
                result.Message = `${getresturent.length} Orders found`;
                return result;
                }

                const getresturent = await this.ordrepo.find({
                    relations: { orderitems: {menu:true} , table:true , payment:true , addOnOrders:{payment:true , addOnOrderItems:{menu:true}} },
                    where: {
                        table: {
                            resturantid: id,
                            resturant: { ownerid: user.userId },
                        },
                    },
                    order: { OrderTime: 'DESC' },
                });
               result.Data = getresturent ?? [];
               result.Message = `${getresturent.length} Orders found`;
            } catch (e) {
                result.Message = String(e);
                result.Success = false;
            }
               return result;
    }

    async getTodaysorders ( id:string , user:any):Promise<Result<Order[]>> {
            const result = new Result<Order[]>();
            try {
                const starttime = new Date();
                starttime.setHours(0 ,0 ,0 ,0);

                const endtime = new Date();
                endtime.setHours(23 , 59 ,59 ,999);
                if(user.role == "admin"){
                    const getresturent = await this.ordrepo.find({relations:{orderitems:{menu:true} , table:true , payment:true , addOnOrders:{payment:true , addOnOrderItems:{menu:true}}} , where:{OrderTime: Between(starttime , endtime) , table:{
                    reservationId:id 
                }}});
                
                result.Data = getresturent ?? [];
                result.Message = `${getresturent.length} Orders found`;
                return result;
                }

                const getresturent = await this.ordrepo.find({
                    relations: { orderitems: {menu:true} , table:true , payment:true , addOnOrders:{payment:true , addOnOrderItems:{menu:true}} },
                    where: {OrderTime: Between(starttime , endtime),
                        table: {
                            resturantid: id,
                            resturant: { ownerid: user.userId },
                        },
                    },
                    order: { OrderTime: 'DESC' },
                });
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
                            {OrderStatus:data.Status}
                        ]
                    });
                
                result.Data = getresturent ?? [];
                result.Message = `${getresturent.length} Orders found`;
                return result;
                }

               const getresturent = await this.ordrepo.find({
                        where:[{table:{resturantid:data.ResturentId , resturant:{ownerid:user.userId}}},
                            {payment:{status:data.paymentstatus}},
                            {OrderStatus:data.Status}
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
    async update(data:UpdateOrderDto, user:any):Promise<Result<Order>> {
            const result = new Result<Order>();
            try {
                let order: Order | null;
                if(user.role == "admin"){
                    order = await this.ordrepo.findOne({ where: { id: data.id } , relations:{payment:true , table:true}});
                } else {
                    order = await this.ordrepo.findOne({
                        where: {
                            id: data.id,
                            table: { resturant: { ownerid: user.userId } },
                        },relations:{payment:true , table:true}
                    });
                }

                if(order == null){
                    result.Message = "No Order Found";
                    result.Success = false;
                    return result;
                }
                if(data.OrderStatus === OrderStatus.Cancled && order.payment?.status == PaymentStatus.Paid){

                    const obj:WithdrawalRequestDto = { amount:order.payment.amount , type:WithdrawalType.Refund , paymentMethod:order.payment.paymentMethode , accountNumber:order.payment.acountNumber
                    } 
                    const resp = await this.walletService.applywidthdraw(order.table?.resturantid , user.userId , obj);
                    
                    if(resp.Success){
                    result.Data = await this.ordrepo.save(data);
                    result.Message = "Order updated refund request Submitted";
                    return result;
                    }
                    if(!resp.Success && resp.Message == "Insufficient balance for withdrawal"){
                        result.Message = resp.Message;
                        result.Success = false;
                    return result;
                    }
                    result.Data = await this.ordrepo.save(data);
                    result.Message = "Order updated but couldent refunt at this moment";
                    result.Success = false;
                    return result;
                }

                result.Data = await this.ordrepo.save(data);
                result.Message = "Order updated";
            } catch (e) {
                result.Message = String(e);  
                result.Success = false;
            }
               return result;
    }

    async createAddOnOrder(data:AddOnOrderDto):Promise<Result<AddOnOrder>> {
            const result = new Result<AddOnOrder>();
            try {
                const parentOrder = await this.ordrepo.findOne({
                    where: { id: data.orderId },
                    relations: { table: { resturant: true } },
                });

                if (!parentOrder) {
                    result.Message = "Original order not found";
                    result.Success = false;
                    return result;
                }

                const restaurant = await this.resrepo.findOne({
                    where: { tables: { id: parentOrder.tableId } },
                    relations: { menu: true, tables: true },
                });

                if (!restaurant) {
                    result.Message = "Restaurant or table not found";
                    result.Success = false;
                    return result;
                }

                if (!data.payment) {
                    result.Message = "Payment details are required for add-on order";
                    result.Success = false;
                    return result;
                }

                const addOnOrderId = `AON-${randomUUID()}`;
                let payable = 0;
                const menuItems = restaurant.menu ?? [];

                for (const orderItem of data.orderitems) {
                    const menuItem = menuItems.find((item) => item.id === orderItem.itemId);
                    if (!menuItem) {
                        result.Message = `Menu item ${orderItem.itemId} was not found in this restaurant`;
                        result.Success = false;
                        return result;
                    }

                    const price = orderItem.quantity * Number(menuItem.price);
                    orderItem.price = price;
                    orderItem.addOnOrderId = addOnOrderId;
                    orderItem.orderId = undefined;
                    payable += price;
                }

                data.payment.addOnOrderId = addOnOrderId;
                data.payment.orderId = undefined;
                data.payment.amount = payable;

                const makepayment = await this.paymentService.makepayment(data.payment);
                if (!makepayment.Success) {
                    result.Message = makepayment.Message;
                    result.Success = false;
                    return result;
                }

                data.payment.status = PaymentStatus.Paid;
                data.payment.transectionId = makepayment.Data?.transectionId;

                const addOnOrder = await this.addOnOrderRepo.save({
                    id: addOnOrderId,
                    orderId: data.orderId,
                    payable,
                    discount: data.discount ?? 0,
                    OrderStatus: data.OrderStatus ?? OrderStatus.Pending,
                    order: parentOrder,
                } as AddOnOrder);

                await this.orditemrepo.save(data.orderitems);
                const payment = await this.paymentService.createPayment(data.payment);
                if (!payment.Success) {
                    result.Message = payment.Message;
                    result.Success = false;
                    return result;
                }

                if (data.payment.status === PaymentStatus.Paid && data.payment.paymentMethode !== paymentMethod.Cash) {
                    const wallet = await this.walletService.addtowallet({
                        restaurantId: restaurant.id,
                        balance: payable,
                    }, payment.Data);
                    if (!wallet.Success) {
                        result.Message = wallet.Message;
                        result.Success = false;
                        return result;
                    }
                }

                result.Data = await this.addOnOrderRepo.findOne({
                    where: { id: addOnOrder.id },
                    relations: { payment: true, addOnOrderItems: { menu: true } },
                }) ?? addOnOrder;
                result.Message = "Add-on order created successfully";
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
              data.orderdetails.OrderStatus = OrderStatus.Pending;
                            const getresturent = await this.resrepo.findOne({where:{tables:{id:data.orderdetails.tableId} }, relations:{menu:true , tables:true}})
              
                            if(getresturent === null){
                                result.Message = "no resturent or table found"
                                result.Success = false;
                                return result;
                            }
                
                            const table = getresturent.tables?.[0];

                             if(table?.status !== TableStatus.Available){
                                result.Message = `The table is ${table?.status}`;
                                result.Success = false ;
                                return result;
                             }

               if(getresturent.payfirst == true && data.payment.paymentMethode === paymentMethod.Card){
                result.Message = "Go to The Counter to Pay In cash and Order"
                result.Success = false;
                return result;
               }

            data.orderdetails.payable = 0;
            const menuItems = getresturent.menu ?? [];
            for (const orderItem of data.orderitems) {
                const menuItem = menuItems.find((item) => item.id === orderItem.itemId);
                if (!menuItem) {
                    result.Message = `Menu item ${orderItem.itemId} was not found in this restaurant`;
                    result.Success = false;
                    return result;
                }

                const price = orderItem.quantity * Number(menuItem.price);
                orderItem.price = price;
                orderItem.orderId = orderId;
                data.orderdetails.payable += price;
            }

            data.payment.amount = Number(data.orderdetails.payable.toFixed(2));
            const makepayment = await this.paymentService.makepayment(data.payment);
            if(!makepayment.Success){
                result.Message = makepayment.Message;
                result.Success = false;
                return result;
            }
            // data.payment.transectionId = makepayment.Data?.transectionId;
            if(makepayment.Success){
             data.payment.status = PaymentStatus.Paid;
             data.payment.transectionId = makepayment.Data?.transectionId;
            }
            if(getresturent.payfirst == true && makepayment.Data?.status !== PaymentStatus.Paid){
                result.Message = "Pay first"
                result.Success = false;
                return result;
            }

             const saveorder = await this.ordrepo.save(data.orderdetails);  
             const saveorderitems = await this.orditemrepo.save(data.orderitems);
             const payment = await  this.paymentService.createPayment(data.payment);
             if(!payment.Success){
                result.Message = payment.Message;
                result.Success = false;
                return result;
             }

             if (data.payment.status === PaymentStatus.Paid && data.payment.paymentMethode !== paymentMethod.Cash) {
                const wallet = await this.walletService.addtowallet({
                    restaurantId: getresturent.id,
                    balance: data.orderdetails.payable,
                }, payment.Data);
                if (!wallet.Success) {
                    result.Message = wallet.Message;
                    result.Success = false;
                    return result;
                }
             }

                 table.status = TableStatus.Occupied;
                 await this.tablerepo.save(table);
             result.Data = saveorder ;
             result.Message = "Order saved ";
            } catch (e) {
                result.Message = String(e);
                result.Success = false;
            }
               return result;
    }
}
