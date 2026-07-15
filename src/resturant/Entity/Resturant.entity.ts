import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, Matches } from "class-validator";
import { users } from "src/user/Entity/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("restaurants")
export class Resturant {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    @IsNotEmpty()
    resturantName!: string;

    @Column({ type: "varchar", length: 500, nullable: false })
    @IsOptional()
    address!: string;

    @Column({ type: "boolean", default: true })
    @IsBoolean()
    isopen!: boolean;

    @Column({ type: "varchar", length: 20 })
    @Matches(/^(?:1[0-2]|0?[1-9]):[0-5]\d\s?(?:[Aa][Mm]|[Pp][Mm])$/, { message: "Time must be in 12-hour format with AM/PM (e.g., 12:40 PM or 09:30 AM)." })
    opening!: string;

    @Column({ type: "varchar", length: 20 })
    @Matches(/^(?:\+?88)?01[3-9]\d{8}$/, { message: "Invalid phone number (e.g., +8801XXXXXXXX or 01XXXXXXXX)." })
    phone!: string;

    @Column({ type: "varchar", length: 255 })
    @IsEmail()
    Resturantemail!: string;

    @Column({ type: "varchar", length: 20 })
    @Matches(/^(?:1[0-2]|0?[1-9]):[0-5]\d\s?(?:[Aa][Mm]|[Pp][Mm])$/, { message: "Time must be in 12-hour format with AM/PM (e.g., 12:40 PM or 09:30 AM)." })
    closing!: string;

    @Column({ type: "boolean", default: false })
    payfirst!: boolean;

    @OneToOne(()=> users , (users)=> users.id , {
        nullable : false,
        onDelete:'CASCADE'
    })
    @JoinColumn()
    ownerid!:string;

    @CreateDateColumn()
    createdat!: Date;

    @UpdateDateColumn()
    updated!: Date;
}