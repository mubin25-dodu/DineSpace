import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, Matches, matches } from "class-validator";
import { Column, Entity, PrimaryColumnCannotBeNullableError, PrimaryGeneratedColumn } from "typeorm/browser";

@Entity()
export class Resturant{
    @PrimaryGeneratedColumn("uuid")
    id:string;
    @Column()
    @IsNotEmpty()
    resturantName:string;
    @Column()
    @IsOptional()
    address:string;
    @IsBoolean()
    @Column()
    isopen:boolean;
    @Column()
    @Matches(/^(?:1[0-2]|0?[1-9]):[0-5]\d\s?(?:[Aa][Mm]|[Pp][Mm])$/, {message: "Time must be in 12-hour format with AM/PM (e.g., 12:40 PM or 09:30 AM)."})
    opening:string;
    @Column()
    @Matches(/^(?:\+?88)?01[3-9]\d{8}$/ , {message:"Invalid phone number (e.g., +8801XXXXXXXX or 01XXXXXXXX)."})
    phone:string;
    @Column()
    @IsEmail()
    email:string;
    @Column()
    @Matches(/^(?:1[0-2]|0?[1-9]):[0-5]\d\s?(?:[Aa][Mm]|[Pp][Mm])$/, {message: "Time must be in 12-hour format with AM/PM (e.g., 12:40 PM or 09:30 AM)."})
    closing:string;
    @Column()
    payfirst:boolean; 
}