import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { TablesService } from './tables.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/jwtGuard.guard';
import { RolesGuard } from 'src/auth/Role/Roles.Guard';
import { Roles } from 'src/auth/Role/Roles.decorator';
import { Result } from 'src/SharedServices/Result';
import { TableDto } from './Dto/Table.dto';
import { ResturantDto } from 'src/resturant/DTO/Resturant.Dto';
import { PartialTableDto } from './Dto/PartialTable.dto';
import { Tables } from './Entity/Tables.entity';
import { TableStatus } from './Enum/tablestatus.enum';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @ApiBearerAuth('bearerAuth')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles('owner')
  @Post('creatTable')
  Creattable(@Body() table: TableDto[] , @Req() req:any): Promise<Result<ResturantDto | Tables[]>> {
    return this.tablesService.creatTable(table , req.user);
  }
  
  @ApiBearerAuth('bearerAuth')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles('owner')
  @Patch('update')
  Update(@Body() table: PartialTableDto[], @Req() req:any): Promise<Result<ResturantDto | Tables[]>> {
    return this.tablesService.update(table , req.user);
  }
  @ApiBearerAuth('bearerAuth')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles('owner')
  @Delete('DeleteTable/:id')
  delete(@Param("id") id:string, @Req() req:any): Promise<Result<ResturantDto>> {
    return this.tablesService.deletetable(id , req.user);
  }


  @ApiBearerAuth('bearerAuth')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles('owner')
  @Patch('TableMakeaAvailable/:id')
  Tableisavailabe(@Param("id") id:string, @Req() req:any): Promise<Result<Tables>> {
    return this.tablesService.tableStatus(id , req.user, TableStatus.Isavailable);
  }
  @ApiBearerAuth('bearerAuth')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles('owner')
  @Patch('TableMakeaoccupied/:id')
  tableoccupied(@Param("id") id:string, @Req() req:any): Promise<Result<Tables>> {
    return this.tablesService.tableStatus(id , req.user, TableStatus.isoccupied);
  }
 

  @ApiBearerAuth('bearerAuth')
  @UseGuards(jwtGuard, RolesGuard)
  @Roles('owner')
  @Patch('TableMakereserved/:id')
  tablereserve(@Param("id") id:string, @Req() req:any): Promise<Result<Tables>> {
    return this.tablesService.tableStatus(id , req.user, TableStatus.isreserved);
  }

  
}
