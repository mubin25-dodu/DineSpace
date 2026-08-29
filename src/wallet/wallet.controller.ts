import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Roles } from 'src/auth/Role/Roles.decorator';
import { Result } from 'src/SharedServices/Result';
import { Wallet } from './Entity/wallet.entity';
import { WithdrawalRequestDto } from './Dto/WithdrawalRequest.dto';
import { WithdrawalRequest } from './Entity/WithdrawalRequest.entity';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  
      @ApiBearerAuth('bearerAuth')
      @UseGuards(jwtGuard, RolesGuard)
      @Roles("owner" , "admin")
      @Get('MyWallet/:resturentId')
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
}
