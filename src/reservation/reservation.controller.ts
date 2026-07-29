import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Query } from '@nestjs/common';
import { ReservationStatus } from './Enum/reservationstatus.enum';

import { ReservationService } from './reservation.service';
import { ReservationDto } from './Dto/Reservation.dto';
import { PartialReservationDto } from './Dto/PartialReservation.dto';

import { jwtGuard } from 'src/auth/jwtGuard.guard';

@ApiTags('Reservation')
@ApiBearerAuth('bearerAuth')
@UseGuards(jwtGuard)
@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
  ) {}

  // Customer creates reservation
  @Post('CreateReservation')
  async CreateReservation(
    @Body() reservation: ReservationDto[],
    @Req() req: any,
  ) {
    return await this.reservationService.createReservation(
      reservation,
      req.user,
    );
  }

  // Customer views own reservations
  @Get('MyReservations')
  async MyReservations(@Req() req: any) {
    return await this.reservationService.FindByUser(
      req.user.userId,
    );
  }

  // Owner views all reservations of a restaurant
  @Get('RestaurantReservations/:restaurantId')
  async RestaurantReservations(
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.reservationService.FindByRestaurant(
      restaurantId,
    );
  }

  // Get reservation by ID
  @Get(':id')
  async GetReservation(
    @Param('id') id: string,
  ) {
    return await this.reservationService.FindbyID(id);
  }

  // Customer updates own reservation
  @Patch('UpdateReservation')
  async UpdateReservation(
    @Body() reservation: PartialReservationDto,
    @Req() req: any,
  ) {
    return await this.reservationService.UpdateReservation(
      reservation,
      req.user,
    );
  }

  // Owner updates reservation status
  @Patch('UpdateStatus/:id/:status')
  async UpdateStatus(
    @Param('id') id: string,
    @Param('status') status: string,
  ) {
    return await this.reservationService.UpdateReservationStatus(
      id,
      status,
    );
  }

  // Customer deletes own reservation
  @Delete('DeleteReservation/:id')
  async DeleteReservation(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return await this.reservationService.DeleteReservation(
      id,
      req.user,
    );
  }
  @Get("SearchReservations")
async SearchReservations(

    @Query("restaurantId") restaurantId?: string,

    @Query("status") status?: ReservationStatus,

    @Query("reservationDate") reservationDate?: string,

    @Query("page") page = 1,

    @Query("limit") limit = 10,

    @Query("sortBy") sortBy = "reservationDate",

    @Query("order") order: "ASC" | "DESC" = "ASC",

) {

    return await this.reservationService.SearchReservations(

        restaurantId,

        status,

        reservationDate,

        Number(page),

        Number(limit),

        sortBy,

        order,

    );
}
}