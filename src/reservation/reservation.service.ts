import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reservation } from './Entity/Reservation.entity';
import { ReservationDto } from './Dto/Reservation.dto';
import { PartialReservationDto } from './Dto/PartialReservation.dto';
import { ReservationStatus } from './Enum/reservationstatus.enum';

import { Result } from 'src/SharedServices/Result';

@Injectable()
export class ReservationService {
private readonly logger = new Logger(ReservationService.name);
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationrepo: Repository<Reservation>,
    ) { }

    async createReservation(
        reservation: ReservationDto[],
        user: any,
    ): Promise<Result<Reservation[]>> {

        const result = new Result<Reservation[]>();

        try {

            const checkids = reservation.filter(e => e.id !== undefined);

            if (checkids.length > 0) {
                result.Success = false;
                result.Message = "Can not provide ids when creating reservation";
                return result;
            }

            reservation.forEach(e => {
                e.userId = user.userId;
                e.status = ReservationStatus.PENDING;
            });

            const create = await this.reservationrepo.save(reservation);
            this.logger.log(
    `User ${user.userId} created ${create.length} reservation(s)`
);

            if (!create) {
                result.Success = false;
                result.Message = "Couldn't create reservation";
                return result;
            }

            result.Data = create;
            result.Message = "Reservation created successfully";

        }
        catch (e) {

            result.Success = false;
            result.Message = String(e);

        }

        return result;
    }

    async FindbyID(
        id: string,
    ): Promise<Result<Reservation>> {

        const result = new Result<Reservation>();

        try {

            const reservation = await this.reservationrepo.findOne({
                where: {
                    id: id,
                },
            });

            if (!reservation) {

                result.Success = false;
                result.Message = "Reservation not found";
                return result;

            }

            result.Data = reservation;
            result.Message = "Reservation Found";

        }
        catch (e) {

            result.Success = false;
            result.Message = String(e);

        }

        return result;
    }

    async FindByUser(
        userId: string,
    ): Promise<Result<Reservation[]>> {

        const result = new Result<Reservation[]>();

        try {

            const reservations = await this.reservationrepo.find({
                where: {
                    userId: userId,
                },
            });

            result.Data = reservations;
            result.Message = `${reservations.length} Reservation Found`;

        }
        catch (e) {

            result.Success = false;
            result.Message = String(e);

        }

        return result;
    }

    async FindByRestaurant(
        restaurantId: string,
    ): Promise<Result<Reservation[]>> {

        const result = new Result<Reservation[]>();

        try {

            const reservations = await this.reservationrepo.find({
                where: {
                    restaurantId: restaurantId,
                },
            });

            result.Data = reservations;
            result.Message = `${reservations.length} Reservation Found`;

        }
        catch (e) {

            result.Success = false;
            result.Message = String(e);

        }

        return result;
    }

    async UpdateReservation(
        reservation: PartialReservationDto,
        user: any,
    ): Promise<Result<Reservation>> {

        const result = new Result<Reservation>();

        try {

            const existing = await this.FindbyID(reservation.id!);

            if (!existing.Success || !existing.Data) {

                result.Success = false;
                result.Message = "Reservation not found";
                return result;

            }

            if (existing.Data.userId != user.userId) {

                result.Success = false;
                result.Message = "You are not allowed to update this reservation";
                return result;

            }

            Object.assign(existing.Data, reservation);

            const update = await this.reservationrepo.save(existing.Data);

            result.Data = update;
            result.Message = "Reservation updated successfully";

        }
        catch (e) {

            result.Success = false;
            result.Message = String(e);

        }

        return result;
    }

    async UpdateReservationStatus(
        id: string,
        status: string,
    ): Promise<Result<Reservation>> {

        const result = new Result<Reservation>();

        try {

            const reservation = await this.reservationrepo.findOne({
                where: {
                    id: id,
                },
            });

            if (!reservation) {

                result.Success = false;
                result.Message = "Reservation not found";
                return result;

            }

            switch (status) {

                case ReservationStatus.PENDING:
                    reservation.status = ReservationStatus.PENDING;
                    break;

                case ReservationStatus.CONFIRMED:
                    reservation.status = ReservationStatus.CONFIRMED;
                    break;

                case ReservationStatus.CANCELLED:
                    reservation.status = ReservationStatus.CANCELLED;
                    break;

                case ReservationStatus.COMPLETED:
                    reservation.status = ReservationStatus.COMPLETED;
                    break;

                default:
                    result.Success = false;
                    result.Message = "Invalid reservation status";
                    return result;

            }

            const update = await this.reservationrepo.save(reservation);
            this.logger.log(
    `Reservation ${id} status changed to ${status}`
);

            result.Data = update;
            result.Message = "Reservation status updated successfully";

        }
        catch (e) {

            result.Success = false;
            result.Message = String(e);

        }

        return result;
    }

    async DeleteReservation(
        id: string,
        user: any,
    ): Promise<Result<null>> {

        const result = new Result<null>();

        try {

            const reservation = await this.reservationrepo.findOne({
                where: {
                    id: id,
                },
            });

            if (!reservation) {

                result.Success = false;
                result.Message = "Reservation not found";
                return result;

            }

            if (reservation.userId != user.userId) {

                result.Success = false;
                result.Message = "You are not allowed to delete this reservation";
                return result;

            }

            await this.reservationrepo.remove(reservation);
            this.logger.log(
    `Reservation ${reservation.id} deleted by ${user.userId}`
);

            result.Message = "Reservation deleted successfully";

        }
        catch (e) {

            result.Success = false;
            result.Message = String(e);

        }

        return result;
    }
    async SearchReservations(
    restaurantId?: string,
    status?: ReservationStatus,
    reservationDate?: string,
    page = 1,
    limit = 10,
    sortBy = 'reservationDate',
    order: 'ASC' | 'DESC' = 'ASC',
): Promise<Result<Reservation[]>> {

    const result = new Result<Reservation[]>();

    try {

        const query = this.reservationrepo.createQueryBuilder("reservation");

        if (restaurantId) {
            query.andWhere("reservation.restaurantId = :restaurantId", {
                restaurantId,
            });
        }

        if (status) {
            query.andWhere("reservation.status = :status", {
                status,
            });
        }

        if (reservationDate) {
            query.andWhere("reservation.reservationDate = :reservationDate", {
                reservationDate,
            });
        }

        query.orderBy(
            `reservation.${sortBy}`,
            order,
        );

        query.skip((page - 1) * limit);

        query.take(limit);

        const reservations = await query.getMany();

        result.Data = reservations;

        result.Message = `${reservations.length} reservation(s) found`;

        this.logger.log("Reservation search executed");

    } catch (e) {

        result.Success = false;

        result.Message = String(e);

    }

    return result;
}
}