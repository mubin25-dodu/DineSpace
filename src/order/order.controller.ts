import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

    @ApiBearerAuth('bearerAuth')
    @UseGuards(jwtGuard, RolesGuard)
    @Roles("owner" , "admin")
    @Get('GetallOrders/:resturentId')
    getorders( @Param("resturentId")resturentId:string ,@Req() req:any):Promise<Result<Order[]>> {
      return this.orderService.getall(resturentId , req.user);
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

    @ApiBearerAuth('bearerAuth')
    @UseGuards(jwtGuard, RolesGuard)
    @Roles("owner" , "admin")
    @Post('filterOrders')
    FilterOrders(@Body() data:filterDto ,@Req() req:any):Promise<Result<Order[]>> {
      return this.orderService.filterOrders(data , req.user);
    }
    @ApiBearerAuth('bearerAuth')
    @UseGuards(jwtGuard, RolesGuard)
    @Roles("owner" , "admin")
    @Patch('updateOrders')
    update(@Body() data:UpdateOrderDto , @Req() req:any):Promise<Result<Order>> {
      return this.orderService.update(data , req.user);
    }
}
