import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, In, Like, Raw, Repository, DataSource } from 'typeorm';
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
import { WithdrawalRequestDto } from 'src/wallet/Dto/WithdrawalRequest.dto';
import { WithdrawalType } from 'src/wallet/Enum/WithdrawalType.enum';
import { AddOnOrder } from './Entity/AddOnOrder.entity';
import { AddOnOrderDto } from './Dto/AddOnOrder.dto';
import { Payment } from 'src/payment/Entity/payment.entity';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { CheckOrderStatusDto } from './Dto/CheckOrderStatus.dto';
import { GetOrdersPageQueryDto, GetOrdersQueryDto } from './Dto/GetOrdersQuery.dto';
import { Service } from 'src/websock/websock.service';

export interface OrderStatusSummary {
    id: string;
    status: OrderStatus;
    orderedTime: Date;
    restaurant: {
        id: string;
        name: string;
        address: string;
    };
}

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Order) private readonly ordrepo:Repository<Order>,         @InjectRepository(AddOnOrder) private readonly addOnOrderRepo:Repository<AddOnOrder>,        @InjectRepository(OrderedItems) private readonly orditemrepo:Repository<OrderedItems>,
        @InjectRepository(Tables) private readonly tablerepo:Repository<Tables>,
        private paymentService:PaymentService ,
        private walletService:WalletService,
        @InjectRepository(Resturant) private readonly resrepo:Repository<Resturant>,
        private readonly dataSource:DataSource,
        private readonly mailService:MailService,
        private readonly configService:ConfigService,
        private readonly websoc:Service
    ){}

    async getOrderStatusSummaries(data: CheckOrderStatusDto): Promise<Result<OrderStatusSummary[]>> {
        const result = new Result<OrderStatusSummary[]>();
        try {
            const orders = await this.ordrepo.find({
                where: { id: In(data.orderIds) },
                relations: { table: { resturant: true } },
            });

            const ordersById = new Map(orders.map((order) => [order.id, order]));
            result.Data = data.orderIds
                .map((id) => ordersById.get(id))
                .filter((order): order is Order => order !== undefined && order.table?.resturant !== undefined)
                .map((order) => ({
                    id: order.id,
                    status: order.OrderStatus,
                    orderedTime: order.OrderTime,
                    restaurant: {
                        id: order.table!.resturant!.id,
                        name: order.table!.resturant!.resturantName,
                        address: order.table!.resturant!.address,
                    },
                }));
            result.Message = `${result.Data.length} order status summaries found`;
        } catch (e) {
            result.Message = String(e);
            result.Success = false;
        }
        return result;
    }

    async getOrderById(id: string): Promise<Result<Order>> {
        const result = new Result<Order>();
        try {
            const order = await this.ordrepo.findOne({
                where: { id },
                relations: {
                    table: { resturant: true },
                    orderitems: { menu: { images: true } },
                    payment: true,
                },
            });

            if (!order) {
                result.Message = 'Order not found';
                result.Success = false;
                return result;
            }

            result.Data = order;
            result.Message = 'Order found';
        } catch (e) {
            result.Message = String(e);
            result.Success = false;
        }
        return result;
    }

    async getOrdersByFilters(
        resturantId: string,
        filters: GetOrdersQueryDto,
        user: any,
    ): Promise<Result<Order[]>> {
        const result = new Result<Order[]>();
        try {
            if (user.role !== 'admin') {
                const restaurant = await this.resrepo.findOne({
                    where: { id: resturantId, ownerid: user.userId },
                });
                if (!restaurant) {
                    result.Success = false;
                    result.Message = 'Restaurant not found or access denied';
                    return result;
                }
            }

            const orderWhere: FindOptionsWhere<Order> = {
                table: { resturantid: resturantId },
            };

            if (filters.status && filters.status !== 'All' ) {
                orderWhere.OrderStatus = filters.status;
            }

            const where: FindOptionsWhere<Order>[] = filters.searchTerm
                ? [
                    {
                        ...orderWhere,
                        id: Like(`%${filters.searchTerm}%`),
                    },
                    {
                        ...orderWhere,
                        customerPhone: Raw(
                            (alias) => `CAST(${alias} AS TEXT) LIKE :searchTerm`,
                            { searchTerm: `%${filters.searchTerm}%` },
                        ),
                    },
                ]
                : [orderWhere];

            const orders = await this.ordrepo.find({
                where,
                relations: {
                    orderitems: { menu: true },
                    table: true,
                    payment: true,
                    addOnOrders: { payment: true, addOnOrderItems: { menu: true } },
                },
                order: { OrderTime: 'DESC' },
            });

            result.Data = orders;
            result.Message = `${orders.length} Orders found`;
        } catch (e) {
            result.Message = String(e);
            result.Success = false;
        }
        return result;
    }
    
    async getall(id:string, pageQuery: GetOrdersPageQueryDto, user:any):Promise<Result<Order[]>> {
            const result = new Result<Order[]>();
            try {
                const pageSize = 50;
                const skip = (pageQuery.page - 1) * pageSize;
                if(user.role == "admin"){
                    const [getresturent, totalOrders] = await this.ordrepo.findAndCount({
                        relations: { orderitems: {menu:true} , table:true , payment:true , addOnOrders:{payment:true , addOnOrderItems:{menu:true}} },
                        where:{table:{ reservationId:id }},
                        order: { OrderTime: 'DESC' },
                        skip,
                        take: pageSize,
                    });
                
                result.Data = getresturent;
                result.TotalOrders = totalOrders;
                result.Message = `${getresturent.length} Orders found`;
                return result;
                }

                const [getresturent, totalOrders] = await this.ordrepo.findAndCount({
                    relations: { orderitems: {menu:true} , table:true , payment:true , addOnOrders:{payment:true , addOnOrderItems:{menu:true}} },
                    where: {
                        table: {
                            resturantid: id,
                            resturant: { ownerid: user.userId },
                        },
                    },
                    order: { OrderTime: 'DESC' },
                     skip,
                     take: pageSize,
                 });
                result.Data = getresturent;
                 result.TotalOrders = totalOrders;
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
                    result.TotalOrders = getresturent.length;
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
                    result.TotalOrders = getresturent.length;
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
                if(data.OrderStatus === OrderStatus.Cancled && order.payment?.status == PaymentStatus.Paid && order.payment.paymentMethode !== paymentMethod.Cash){
                    const obj:WithdrawalRequestDto = { amount:order.payment.amount , type:WithdrawalType.Refund , paymentMethod:order.payment.paymentMethode , accountNumber:order.payment.acountNumber
                    } 
                    const resp = await this.walletService.applywidthdraw(order.table?.resturantid , user.userId , obj);
                    
                    if(resp.Success){
                    result.Data = await this.ordrepo.save(data);
                    result.Message = "Order updated refund request Submitted";
                    return result;
                    }
                    if(!resp.Success && resp.Message == "Insufficient balance for withdrawal"){
                        result.Message = "Refund request failed due to insufficient balance";
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

    private escapeHtml(value:string):string {
        return value.replace(/[&<>"']/g, (character) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        }[character] ?? character));
    }

    private async sendOrderConfirmation(order:Order, payment:Payment):Promise<string | null> {
        if (!order.customerEmail) {
            return "Order created, but no customer email is available for the confirmation";
        }

        const frontendUrl = this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
        const orderUrl = `${frontendUrl.replace(/\/$/, '')}/user/myorders/${order.id}`;
        const mailResult = await this.mailService.sendmail({
            recipients: [order.customerEmail],
            subject: `Order ${order.id} received`,
            html: `<p>Hello ${this.escapeHtml(order.customerName)},</p>
                <p>Thank you for your order. We have received it successfully.</p>
                <p><strong>Order ID:</strong> ${this.escapeHtml(order.id)}</p>
                <p><strong>Total:</strong> ${Number(order.payable).toFixed(2)}</p>
                <p><strong>Payment method:</strong> ${this.escapeHtml(payment.paymentMethode)}</p>
                <p><strong>Payment status:</strong> ${this.escapeHtml(payment.status)}</p>
                ${payment.transectionId ? `<p><strong>Transaction ID:</strong> ${this.escapeHtml(payment.transectionId)}</p>` : ''}
                <p><a href="${this.escapeHtml(orderUrl)}">View your order</a></p>`,
            text: [
                `Your order ${order.id} was received.`,
                `Total: ${Number(order.payable).toFixed(2)}`,
                `Payment method: ${payment.paymentMethode}`,
                `Payment status: ${payment.status}`,
                payment.transectionId ? `Transaction ID: ${payment.transectionId}` : '',
                `View your order: ${orderUrl}`,
            ].filter(Boolean),
        });

        return mailResult.Success
            ? null
            : `Order created, but confirmation email could not be sent: ${mailResult.Message}`;
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
              if (!data.payment) {
                result.Message = "Payment details are required";
                result.Success = false;
                return result;
              }

              data.orderdetails.id  = orderId;
              data.orderdetails.OrderStatus = OrderStatus.Pending;
                            const getresturent = await this.resrepo.findOne({where:{tables:{id:data.orderdetails.tableId} }, relations:{menu:true , tables:true}})
              
                            if(getresturent === null){
                                result.Message = "no resturent or table found"
                                result.Success = false;
                                return result;
                            }
                
                            const table = getresturent.tables?.[0];
                            const tableIsCleaning = table?.status === TableStatus.Cleaning;

                             if(!table || (table.status !== TableStatus.Available && !tableIsCleaning)){
                                result.Message = `The table is ${table?.status}`;
                                result.Success = false ;
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

            const payableAmount = Number(data.orderdetails.payable.toFixed(2));
            data.orderdetails.payable = payableAmount;
            data.payment.amount = payableAmount;
            data.payment.orderId = orderId;

            if (data.payment.paymentMethode === paymentMethod.Cash) {
                data.payment.transectionId = `Cash-${randomUUID()}`;
                data.payment.status = PaymentStatus.Pending;
            } else {
                if (!data.payment.transectionId) {
                    result.Message = "A fake payment transaction ID is required";
                    result.Success = false;
                    return result;
                }

                const transaction = await this.paymentService.findSuccessfulTransaction(
                    data.payment.transectionId,
                );
                if (!transaction) {
                    result.Message = "Payment transaction was not found or was not successful";
                    result.Success = false;
                    return result;
                }
                if (transaction.orderId) {
                    result.Message = "Payment transaction has already been used";
                    result.Success = false;
                    return result;
                }
                if (transaction.paymentMethode !== data.payment.paymentMethode) {
                    result.Message = "Payment method does not match the transaction";
                    result.Success = false;
                    return result;
                }
                if (Number(transaction.amount) !== payableAmount) {
                    result.Message = "Payment amount does not match the order amount";
                    result.Success = false;
                    return result;
                }

                transaction.orderId = orderId;
                data.payment.acountNumber = transaction.acountNumber;
                data.payment.status = PaymentStatus.Paid;
            }

             const queryRunner = this.dataSource.createQueryRunner();
             await queryRunner.connect();
             await queryRunner.startTransaction();
             let saveorder: Order;
             let savedPayment: Payment;
             try {
                 const paymentRepo = queryRunner.manager.getRepository(Payment);
                 let payment: Payment | undefined;
                 let gatewayPayment: Payment | undefined;
                 if (data.payment.status === PaymentStatus.Paid) {
                     gatewayPayment = (await paymentRepo.findOne({
                         where: {
                             transectionId: data.payment.transectionId,
                             status: PaymentStatus.Paid,
                         },
                         lock: { mode: "pessimistic_write" },
                     })) ?? undefined;
                     if (!gatewayPayment || gatewayPayment.orderId) {
                         throw new Error("Payment transaction is invalid or already used");
                     }
                     if (gatewayPayment.paymentMethode !== data.payment.paymentMethode ||
                         Number(gatewayPayment.amount) !== payableAmount) {
                         throw new Error("Payment transaction details do not match");
                     }
                     gatewayPayment.status = PaymentStatus.Paid;
                     gatewayPayment.acountNumber =
                         data.payment.acountNumber ?? gatewayPayment.acountNumber;
                 }

                 saveorder = await queryRunner.manager.getRepository(Order).save(data.orderdetails);
                 await queryRunner.manager.getRepository(OrderedItems).save(data.orderitems);
                 if (gatewayPayment) {
                     gatewayPayment.orderId = orderId;
                     payment = await paymentRepo.save(gatewayPayment);
                 } else {
                     payment = paymentRepo.create(data.payment);
                     payment.orderId = orderId;
                     payment = await paymentRepo.save(payment);
                 }
                 savedPayment = payment;
                 if (payment.status === PaymentStatus.Paid) {
                     await this.walletService.creditWallet(
                         queryRunner.manager,
                         getresturent.id,
                         payableAmount,
                         payment,
                     );
                 }

                 table.status = TableStatus.Occupied;
                 await queryRunner.manager.getRepository(Tables).save(table);
                 await queryRunner.commitTransaction();
                 this.websoc.getSubs(
                    getresturent.id , 'newOrder' , {
                        orderId:saveorder.id
                    }
                 )
             } catch (e) {
                 await queryRunner.rollbackTransaction();
                 throw e;
             } finally {
                 await queryRunner.release();
             }

             result.Data = saveorder ;
             result.Message = tableIsCleaning
                ? "Order accepted. The table is currently being cleaned. Please give us some time to prepare it for you; meanwhile, you can wait in the waiting zone."
                : data.payment.paymentMethode === paymentMethod.Cash
                    ? "Order saved. Please go to the counter to pay in cash."
                    : "Order saved";
             const emailMessage = await this.sendOrderConfirmation(saveorder, savedPayment);
             if (emailMessage) {
                 result.Message = `${result.Message} ${emailMessage}`;
             }
            } catch (e) {
                result.Message = String(e);
                result.Success = false;
            }
               return result;
    }
}
