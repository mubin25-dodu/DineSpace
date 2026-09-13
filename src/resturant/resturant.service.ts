import { Injectable } from '@nestjs/common';
import { ResturantDto } from './DTO/Resturant.Dto';
import { Result } from 'src/SharedServices/Result';
import { InjectRepository } from '@nestjs/typeorm';
import { Resturant } from './Entity/Resturant.entity';
import { Like, Repository } from 'typeorm';
import { PartialResturantDto } from './DTO/ParticalResturant.Dto';
import { use } from 'passport';
import { WalletService } from 'src/wallet/wallet.service';
import { Order } from 'src/order/Entity/Order.entity';
import { OrderStatus } from 'src/order/enum/OrderStatus.enum';
import { PaymentStatus } from 'src/payment/Enum/PaymentStatus.enum';

export interface RestaurantAnalytics {
    restaurant: Resturant;
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    totalRefunded: number;
    totalProfit: number;
    averageOrderValue: number;
    averageMonthlyProfit: number;
    monthlyEarnings: Array<{
        month: string;
        revenue: number;
        refunded: number;
        profit: number;
        orders: number;
    }>;
}

@Injectable()
export class ResturantService {

    constructor(
        @InjectRepository(Resturant) private readonly Resreo: Repository<Resturant>,
        @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
        private readonly walletService: WalletService,
    ) { }

    async addresturant(data: ResturantDto): Promise<Result<ResturantDto>> {
        const result = new Result<ResturantDto>;
        try {
            data.id = undefined;
            data.resturantemail = data.resturantemail.toLowerCase();
            const check = await this.Findbyemail(data.resturantemail) || await this.Findbyphone(data.phone);

            if (check.Success) {
                result.Message = check.Message;
                result.Success = false;
                return result;
            }
            const create = await this.Resreo.save(data);
            if (create) {
                const wallet = await this.walletService.addtowallet({
                    restaurantId: create.id,
                    balance: 0,
                });
                if (!wallet.Success) {
                    result.Message = wallet.Message || "Could not create restaurant wallet";
                    result.Success = false;
                    return result;
                }
                result.Data = create;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }
    async Findbyemail(email: string): Promise<Result<ResturantDto>> {
        const result = new Result<ResturantDto>;
        try {
            email = email.toLowerCase();
            const create = await this.Resreo.findOne({ where: { resturantemail: email } });
            if (create != null) {
                result.Data = create;
                result.Message = `Resturant with email ${email} Found`;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }
    async getMyResturants(user:any): Promise<Result<Resturant[]>> {
        const result = new Result<Resturant[]>;
        try {
            const get = await this.Resreo.find({where:{ownerid:user.userId} , relations:{files:true, tables:true , menu:true, logoFile:true, coverFile:true}});
            if (get != null) {
                result.Data = get;
                result.Message = `${get.length} resturent Found`;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }
    async getall(user:any): Promise<Result<Resturant[]>> {
        const result = new Result<Resturant[]>;
        try {
            const get = await this.Resreo.find({relations:{files:true, logoFile:true, coverFile:true}});
            if (get != null) {
                result.Data = get;
                result.Message = `${get.length} resturent Found`;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }

    async Findbyphone(phone: string): Promise<Result<ResturantDto>> {
        const result = new Result<ResturantDto>;
        try {
            const create = await this.Resreo.findOne({ where: { phone: phone } });
            if (create != null) {
                result.Data = create;
                result.Message = `Resturant with Phone ${phone} Found`;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }

    async Updateresturant(data: PartialResturantDto , user:any): Promise<Result<Resturant>> {
        const result = new Result<Resturant>;
        try {
            // const check = await this.Findbyemail(data.Resturantemail) || await this.Findbyphone(data.phone);

            // if (check.Success) {
            //     result.Message = check.Message + "try another one";
            //     result.Success = false;
            //     return result;
            // }

            if(data.resturantemail!== undefined || data.phone !== undefined){
                 result.Message ="Can not update email and Phone At this moment";
                result.Success = false;
                return result;
            }
            const getresturent = await this.FindbyID(data.id!);
            if (!getresturent.Success || !getresturent.Data) {
                result.Success = false;
                result.Message = "Restaurant not found";
                return result;
            }
            if(getresturent.Data.ownerid !== user.userId){
                result.Message ="you do not have parmition to update the resturant";
                result.Success = false;
                return result;
            }
            data.ownerid = user.userId;

            Object.assign(getresturent.Data , data)
            const create = await this.Resreo.save(getresturent.Data);
            if (create) {
                result.Data = create;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }

    async toggleBanById(id: string): Promise<Result<Resturant>> {
        const result = new Result<Resturant>();
        try {
            const restaurant = await this.Resreo.findOne({ where: { id } });
            if (!restaurant) {
                result.Success = false;
                result.Message = "Restaurant not found";
                return result;
            }

            restaurant.isBanned = !restaurant.isBanned;
            result.Data = await this.Resreo.save(restaurant);
            result.Message = restaurant.isBanned
                ? "Restaurant banned successfully"
                : "Restaurant unbanned successfully";
        } catch (e) {
            result.Success = false;
            result.Message = String(e);
        }
        return result;
    }

    async getAdminAnalytics(restaurantId: string): Promise<Result<RestaurantAnalytics>> {
        const result = new Result<RestaurantAnalytics>();
        try {
            const restaurant = await this.Resreo.findOne({ where: { id: restaurantId } });
            if (!restaurant) {
                result.Success = false;
                result.Message = "Restaurant not found";
                return result;
            }

            const summaryRows = await this.orderRepo.createQueryBuilder('order_entity')
                .innerJoin('order_entity.table', 'table_entity')
                .innerJoin('table_entity.resturant', 'restaurant')
                .leftJoin('order_entity.payment', 'payment')
                .select('restaurant.id', 'restaurantId')
                .addSelect('COUNT(DISTINCT order_entity.id)', 'totalOrders')
                .addSelect(`COUNT(DISTINCT CASE WHEN order_entity."OrderStatus" = :completed THEN order_entity.id END)`, 'completedOrders')
                .addSelect(`COUNT(DISTINCT CASE WHEN order_entity."OrderStatus" = :pending THEN order_entity.id END)`, 'pendingOrders')
                .addSelect(`COUNT(DISTINCT CASE WHEN order_entity."OrderStatus" = :cancelled THEN order_entity.id END)`, 'cancelledOrders')
                .addSelect(`COALESCE(SUM(CASE WHEN payment.status = :paid THEN payment.amount ELSE 0 END), 0)`, 'totalRevenue')
                .addSelect(`COALESCE(SUM(CASE WHEN payment.status = :refunded THEN payment.amount ELSE 0 END), 0)`, 'totalRefunded')
                .setParameters({
                    completed: OrderStatus.Completed,
                    pending: OrderStatus.Pending,
                    cancelled: OrderStatus.Cancled,
                    paid: PaymentStatus.Paid,
                    refunded: PaymentStatus.Refund,
                })
                .where('restaurant.id = :restaurantId', { restaurantId })
                .groupBy('restaurant.id')
                .getRawMany();

            const monthlyRows = await this.orderRepo.createQueryBuilder('order_entity')
                .innerJoin('order_entity.table', 'table_entity')
                .innerJoin('table_entity.resturant', 'restaurant')
                .leftJoin('order_entity.payment', 'payment')
                .select('restaurant.id', 'restaurantId')
                .addSelect(`TO_CHAR(DATE_TRUNC('month', order_entity."OrderTime"), 'YYYY-MM')`, 'month')
                .addSelect('COUNT(DISTINCT order_entity.id)', 'orders')
                .addSelect(`COALESCE(SUM(CASE WHEN payment.status = :paid THEN payment.amount ELSE 0 END), 0)`, 'revenue')
                .addSelect(`COALESCE(SUM(CASE WHEN payment.status = :refunded THEN payment.amount ELSE 0 END), 0)`, 'refunded')
                .setParameters({
                    paid: PaymentStatus.Paid,
                    refunded: PaymentStatus.Refund,
                })
                .where(`order_entity."OrderTime" >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '11 months'`)
                .andWhere('restaurant.id = :restaurantId', { restaurantId })
                .groupBy('restaurant.id')
                .addGroupBy(`DATE_TRUNC('month', order_entity."OrderTime")`)
                .orderBy(`DATE_TRUNC('month', order_entity."OrderTime")`, 'ASC')
                .getRawMany();

            const monthlyByRestaurant = new Map<string, RestaurantAnalytics['monthlyEarnings']>();
            for (const row of monthlyRows) {
                const monthlyEarnings = monthlyByRestaurant.get(row.restaurantId) ?? [];
                const revenue = Number(row.revenue);
                const refunded = Number(row.refunded);
                monthlyEarnings.push({
                    month: row.month,
                    revenue,
                    refunded,
                    profit: revenue - refunded,
                    orders: Number(row.orders),
                });
                monthlyByRestaurant.set(row.restaurantId, monthlyEarnings);
            }

            const summary = summaryRows[0];
            const totalOrders = Number(summary?.totalOrders ?? 0);
            const totalRevenue = Number(summary?.totalRevenue ?? 0);
            const totalRefunded = Number(summary?.totalRefunded ?? 0);
            const totalProfit = totalRevenue - totalRefunded;
            const monthlyEarnings = monthlyByRestaurant.get(restaurant.id) ?? [];

            result.Data = {
                restaurant,
                totalOrders,
                completedOrders: Number(summary?.completedOrders ?? 0),
                pendingOrders: Number(summary?.pendingOrders ?? 0),
                cancelledOrders: Number(summary?.cancelledOrders ?? 0),
                totalRevenue,
                totalRefunded,
                totalProfit,
                averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
                averageMonthlyProfit: totalProfit / 12,
                monthlyEarnings,
            };
            result.Message = "Restaurant analytics retrieved successfully";
        } catch (e) {
            result.Success = false;
            result.Message = String(e);
        }
        return result;
    }

    async search(term: string): Promise<Result<Resturant[]>> {
        const result = new Result<Resturant[]>;
        try {
            const search = await this.Resreo.find({
                where: [
                    { resturantName: Like(`%${term}%`) },
                    { resturantemail: Like(`%${term}%`) },
                    { address: Like(`%${term}%`) } ,

                ]
            });
            if (search != null) {
                result.Data = search;
                result.Message = `${search.length} Resturents Found`;
                return result;
            }
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }

    // async Uploadfiles(file: Express.Multer.File[], id: string, uploadfor: fileEnum, userId: any): Promise<Result<Resturant>> {
    //     const result = new Result<Resturant>;
    //     try {
    //         const fileDtos: FilesDto[] = file.map(file => ({
    //             FileName: file.filename,
    //             OriginalName: file.originalname,
    //             Path: file.path,
    //             Size: file.size,
    //             UploadedByUserId: userId,
    //             RestaurantId: uploadfor == fileEnum.Resturant ? id : undefined,
    //             MenuId: uploadfor == fileEnum.Menu ? id : undefined,
    //         }));
    //         const save = await this.fileservice.addfiles(fileDtos);
    //         if (!save.Success) {
    //             result.Message = save.Message;
    //             result.Success = false;
    //             return result;
    //         }
    //         result.Message = "images saved successfully"
    //         return result;
    //     }
    //     catch (e) {
    //         result.Message = String(e);
    //         result.Success = false;

    //     }
    //     return result;
    // }

    async deleteresturant(user:any , resturantId:string):Promise<Result<null>>{
        const result = new Result<null>;
    try{
        const checkResturantOwner = await this.Resreo.findOne({where:{id:resturantId , ownerid:user.userId}})
        if(checkResturantOwner !==  null){
            await this.Resreo.softRemove(checkResturantOwner);
            result.Message = "Resturant archived";
            return result;
        }
        result.Message ="you are not the owner or wrong resturent Id";
        result.Success = false;
    }
    catch(e){
        result.Message = String(e);
        result.Success = false;
    }
        return result;
    }
    async FindbyID(id: string): Promise<Result<Resturant>> {
        const result = new Result<Resturant>;
        try {
            const create = await this.Resreo.findOne({
                where: { id },
                relations: {
                    tables: true,
                    files: true,
                    menu: {
                        images: true,
                    },
                    logoFile: true,
                    coverFile: true,
                },
            });
            if (create != null) {
                result.Data = create;
                result.Message = `Resturant Found`;
                return result;
            }

            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }

    async save(restaurant: Resturant): Promise<Resturant> {
        return this.Resreo.save(restaurant);
    }

    async checkResturantowner(resturantid: string , ownerid:string): Promise<Result<Resturant>> {
        const result = new Result<Resturant>;
        try {
            const create = await this.Resreo.findOne({ where: { id:resturantid , ownerid:ownerid } });
            if (create != null) {
                result.Data = create;
                result.Message = `is a valid owner`;
                return result;
            }
            result.Message = `Not a valid owner`;
            result.Success = false;
        }
        catch (e) {
            result.Message = String(e);
            result.Success = false;

        }
        return result;
    }

    
}
