import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Roles } from 'src/auth/Role/Roles.decorator';
import { Result } from 'src/SharedServices/Result';
import { Wallet } from './Entity/wallet.entity';
import { WithdrawalRequestDto } from './Dto/WithdrawalRequest.dto';
import { WithdrawalRequest } from './Entity/WithdrawalRequest.entity';
import { UpdateWithdrawalStatusDto } from './Dto/UpdateWithdrawalStatus.dto';
import { WithdrawalStatus } from './Enum/WithdrawalStatus.enum';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

      @ApiBearerAuth('bearerAuth')
      @UseGuards(jwtGuard, RolesGuard)
      @Roles("admin")
      @Get('withdrawals')
      @ApiQuery({ name: "status", enum: WithdrawalStatus, required: false })
      getWithdrawals(
        @Query("status", new ParseEnumPipe(WithdrawalStatus, { optional: true }))
        status?: WithdrawalStatus,
      ):Promise<Result<WithdrawalRequest[]>> {
        return this.walletService.getAllWithdrawals(status);
      }

      @ApiBearerAuth('bearerAuth')
      @UseGuards(jwtGuard, RolesGuard)
      @Roles("admin")
      @Patch('withdrawal/:withdrawalId/status')
      updateWithdrawalStatus(
        @Param('withdrawalId') withdrawalId:string,
        @Body() data:UpdateWithdrawalStatusDto,
      ):Promise<Result<WithdrawalRequest>> {
        return this.walletService.updateWithdrawalStatus(withdrawalId, data);
      }

      @ApiBearerAuth('bearerAuth')
      @UseGuards(jwtGuard, RolesGuard)
      @Roles("owner" , "admin")
      @Get('wallet/:resturentId')
      getorders( @Param("resturentId")resturentId:string ,@Req() req:any):Promise<Result<Wallet>> {
        return this.walletService.getall(resturentId , req.user.userId);
      }

      @ApiBearerAuth('bearerAuth')
      @UseGuards(jwtGuard, RolesGuard)
      @Roles("owner" , "admin")
      @Post('WidthdrawRequest/:resturentId')
      applywidthdraw( @Param("resturentId")resturentId:string ,@Req() req:any , @Body() data:WithdrawalRequestDto):Promise<Result<WithdrawalRequest>> {
        return this.walletService.applywidthdraw(resturentId , req.user.userId , data);
      }

      @ApiBearerAuth('bearerAuth')
      @UseGuards(jwtGuard, RolesGuard)
      @Roles("owner" , "admin")
      @Delete('withdrawal/:withdrawalId')
      cancelWithdrawal(@Param('withdrawalId') withdrawalId:string, @Req() req:any):Promise<Result<WithdrawalRequest>> {
        return this.walletService.cancelWithdrawal(withdrawalId, req.user.userId);
      }

      @ApiBearerAuth('bearerAuth')
      @UseGuards(jwtGuard, RolesGuard)
      @Roles("owner")
      @Post('refund/:paymentId')
      refund(@Param('paymentId') paymentId:string, @Req() req:any):Promise<Result<WithdrawalRequest>> {
        return this.walletService.refundOrder(paymentId, req.user);
      }
}
