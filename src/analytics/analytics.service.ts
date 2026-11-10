import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { menu } from 'src/menu/Entity/menu.entity';
import { Order } from 'src/order/Entity/Order.entity';
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { DateFilter, Pagination } from 'src/SharedServices/pagnation';
import { Result } from 'src/SharedServices/Result';
import { Between, Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {

    constructor(@InjectRepository(Resturant) private resturantRepo: Repository<Resturant> ,@InjectRepository(menu) private menurepo: Repository<menu>   ) { }
    async getFullAnalyticsMonthly( resturantId: string, user: any , year?: number, month?: number): Promise<Result<unknown>> {
        const result = new Result<unknown>();
        try{
            const isOwner = await this.resturantRepo.findOne({where: {id: resturantId, owner: {id: user.userId}} , relations: {owner: true}});
            if(!isOwner){
                result.Data = null;
                result.Success = false;
                result.Message = "You are not authorized to access this restaurant's analytics.";
                return result;
            }
            const analytics = await this.resturantRepo
              .createQueryBuilder('restaurant')
              .leftJoinAndSelect('restaurant.menu', 'menu')
              .leftJoinAndSelect('menu.orderItems', 'orderItems')
              .where('restaurant.id = :resturantId', { resturantId })
              .select([
                'restaurant.id',
                'restaurant.resturantName',
                // 'COUNT(orderItems.id) AS totalOrders',
                'SUM(orderItems.quantity) AS totalItemsSold',
                // 'SUM(orderItems.totalAmount) AS totalRevenue',
                // 'AVG(orderItems.totalAmount) AS averageOrderValue',
              ])
            //   .groupBy('orderItems.createdAt')
              .getRawOne();
            result.Data = analytics;
            result.Success = true;
            result.Message = "Analytics retrieved successfully.";
        }catch(e){
            console.log(e)
            result.Data = null;
            result.Success = false;
            result.Message = "An error occurred while retrieving analytics.";
        }

        
        return result;
        
    }

    async  menuanalytics(resturantId: string, user: any, datefilter?: DateFilter ): Promise<Result<unknown>> {
        const result  = new Result<unknown>();
        try{
            const isOwner = await this.resturantRepo.findOne({where: {id: resturantId, owner: {id: user.userId}}});
            if(!isOwner){
                result.Data = null;
                result.Success = false;
                result.Message = "You are not authorized to access this restaurant's analytics.";
                return result;
            }
            const query = await this.menurepo
              .createQueryBuilder('menu')
              .leftJoin('menu.orderItems', 'orderitems')
              .where('menu.resturentId = :resturantId', { resturantId } )
              .andWhere('orderitems.createdAt BETWEEN :from AND :to', {
                from: datefilter?.from ? datefilter.from.toISOString() : new Date(0).toISOString(),
                to: datefilter?.to ? datefilter.to.toISOString() : new Date().toISOString(),
              })
              .select([
                'menu.id AS "menuId"',
                'menu.itemName AS "itemName"',
                'menu.price AS "menuPrice"',
              ])
              .addSelect(
                'COALESCE(SUM(orderitems.quantity), 0)',
                'totalItemsSold',
              )
              .addSelect(
                'COALESCE(SUM(orderitems.price * orderitems.quantity), 0)',
                'totalRevenue',
              )
              .groupBy('menu.id')
              .addGroupBy('menu.itemName')
              .addGroupBy('menu.price')
              .orderBy('SUM(orderitems.quantity)', 'DESC')
              .getRawMany();
            if (query) {
                result.Data = query;
                result.Success = true;
                result.Message = "Menu analytics retrieved successfully.";
                return result;
            }
            result.Data = null;
            result.Success = false;
            result.Message = "No menu items found for this restaurant.";

        }catch(e){
        console.log(e)
           result.Data = null;
           result.Success = false;
           result.Message = String(e);
        }

        return result;

    }
}
