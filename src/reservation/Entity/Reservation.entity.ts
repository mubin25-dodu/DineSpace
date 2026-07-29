import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ReservationStatus } from "../Enum/reservationstatus.enum";

@Entity("reservations")
export class Reservation {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "date", nullable: false })
    reservationDate!: Date;

    @Column({ type: "varchar", length: 20, nullable: false })
    reservationTime!: string;

    @Column({ type: "int", nullable: false })
    guestCount!: number;

    @Column({
        type: "enum",
        enum: ReservationStatus,
        default: ReservationStatus.PENDING,
    })
    status!: ReservationStatus;

    @Column({ type: "varchar", length: 255, nullable: true })
    specialRequest?: string;

    @Column({ type: "varchar", nullable: false })
    userId!: string;

    @Column({ type: "varchar", nullable: false })
    restaurantId!: string;

    @Column({ type: "varchar", nullable: false })
    tableId!: string;
}