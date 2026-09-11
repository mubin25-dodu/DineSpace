import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Roles } from 'src/auth/Role/Roles.decorator';
import { Result } from 'src/SharedServices/Result';
import { Order } from './Entity/Order.entity';
import { PlaceorderDto } from './Dto/placeOrder.dto';
import { filterDto } from './Dto/Filterorder.dto';
import { UpdateOrderDto } from './Dto/UpdateOrder';
import { AddOnOrderDto } from './Dto/AddOnOrder.dto';
import { AddOnOrder } from './Entity/AddOnOrder.entity';
import { CheckOrderStatusDto } from './Dto/CheckOrderStatus.dto';
import { OrderStatusSummary } from './order.service';
import { GetOrdersPageQueryDto, GetOrdersQueryDto } from './Dto/GetOrdersQuery.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

    @Get('GetOrderById/:id')
    getOrderById(@Param('id') id:string):Promise<Result<Order>> {
      return this.orderService.getOrderById(id);
    }

    @ApiBearerAuth('bearerAuth')
    @UseGuards(jwtGuard, RolesGuard)
    @Roles("owner" , "admin")
    @Get('filterOrders/:resturentId')
    getOrdersByFilters(
      @Param('resturentId') resturentId:string,
      @Query() filters:GetOrdersQueryDto,
      @Req() req:any,
    ):Promise<Result<Order[]>> {
      return this.orderService.getOrdersByFilters(resturentId, filters, req.user);
    }

    @Post('status')
    getOrderStatusSummaries(@Body() data: CheckOrderStatusDto):Promise<Result<OrderStatusSummary[]>> {
      return this.orderService.getOrderStatusSummaries(data);
    }

    @ApiBearerAuth('bearerAuth')
    @UseGuards(jwtGuard, RolesGuard)
    @Roles("owner" , "admin")
    @Get('GetallOrders/:resturentId')
    getorders(
      @Param("resturentId") resturentId:string,
      @Query() pageQuery:GetOrdersPageQueryDto,
      @Req() req:any,
    ):Promise<Result<Order[]>> {
      return this.orderService.getall(resturentId, pageQuery, req.user);
    }

    @ApiBearerAuth('bearerAuth')
    @UseGuards(jwtGuard, RolesGuard)
    @Roles("owner" , "admin")
    @Get('todaysOrders/:resturentId')
    getTodaysorders( @Param("resturentId")resturentId:string ,@Req() req:any):Promise<Result<Order[]>> {
      return this.orderService.getTodaysorders(resturentId , req.user);
    }

    
    @Post('PlaceOrder')
    placeOrder(@Body() data:PlaceorderDto):Promise<Result<Order>> {
      return this.orderService.makeOrder(data);
    }

    @Post('PlaceAddOnOrder')
    createAddOnOrder(@Body() data:AddOnOrderDto):Promise<Result<AddOnOrder>> {
      return this.orderService.createAddOnOrder(data);
    }

    @ApiBearerAuth('bearerAuth')
    @UseGuards(jwtGuard, RolesGuard)
    @Roles("owner" , "admin")
    @Patch('updateOrders')
    update(@Body() data:UpdateOrderDto , @Req() req:any):Promise<Result<Order>> {
      return this.orderService.update(data , req.user);
    }
}
