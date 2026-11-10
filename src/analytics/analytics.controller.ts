import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiBearerAuth } from 'node_modules/@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Roles } from 'src/auth/Role/Roles.decorator';
import { Result } from 'src/SharedServices/Result';
import { Pagination, DateFilter } from 'src/SharedServices/pagnation';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiBearerAuth('bearerAuth')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles('owner', 'admin')
  @Get('fullAnalyticsMonthly/:resturantId')
  fullAnalytics(
    @Param('resturantId') resturantId: string,
    @Req() req: any,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ): Promise<Result<unknown>> {
    return this.analyticsService.getFullAnalyticsMonthly(
      resturantId,
      req.user,
      year,
      month,
    );
  }

  @ApiBearerAuth('bearerAuth')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles('owner', 'admin')
  @Get('menuanalytics/:resturantId')
  menuanalytics(
    @Param('resturantId') resturantId: string,
    @Req() req: any,
    @Query() datefilter?: DateFilter,
  ): Promise<Result<unknown>> {
    return this.analyticsService.menuanalytics(
      resturantId,
      req.user,
      datefilter,
    );
  }
}
