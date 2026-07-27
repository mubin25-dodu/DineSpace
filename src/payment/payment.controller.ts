import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './Entity/payment.entity';
import { PaymentDto } from './Dto/payment.dto';
import { Result } from 'src/SharedServices/Result';
import { Tables } from 'src/tables/Entity/Tables.entity';
import { partialPaymentDto } from './Dto/partialpayment.Dto';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/Role/Roles.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("createPayment")
  createPayment(@Body() data:PaymentDto):Promise<Result<Payment>>{
    return this.paymentService.createPayment(data);
  }
 // @Patch("PaymentStatus/:id/:status")
  // togglestatus(@Body()data:partialPaymentDto, @Req() req:any):Promise<Result<Payment>>{
  //   return this.paymentService.changestatus(data , req);
  // }

  @UseGuards(jwtGuard , RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Roles("admin" , "owner")
  @Patch("updatePayment")
  togglestatus(@Body()data:partialPaymentDto, @Req() req:any):Promise<Result<Payment>>{
    return this.paymentService.updateinfo(data , req);

  }

  @UseGuards(jwtGuard , RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Roles("admin" , "owner")
  @Get("GetpaymentByResturentId/:Resturentid")
  getall(@Param("Resturentid")Resturentid:string, @Req() req:any):Promise<Result<Payment[]>>{
    return this.paymentService.getallByResturent(Resturentid , req);
  }
 
}
