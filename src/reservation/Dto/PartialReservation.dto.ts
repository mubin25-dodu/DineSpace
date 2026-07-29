import { PartialType } from "@nestjs/mapped-types";
import { ReservationDto } from "./Reservation.dto";

export class PartialReservationDto extends PartialType(ReservationDto) {}