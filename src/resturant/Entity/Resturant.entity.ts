import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, Matches } from "class-validator";
import { Files } from "src/files/Entity/Files.Entity";
import { menu } from "src/menu/Entity/menu.entity";
import { Tables } from "src/tables/Entity/Tables.entity";
import { users } from "src/user/Entity/users.entity";
import { Wallet } from "src/wallet/Entity/wallet.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OneToOne } from "typeorm";

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
    @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/ , { message: "Time must be in 24-hour format (e.g., 13:40 or 09:30)." })
    opening!: string;

    @Column({ type: "varchar", length: 20 })
    @Matches(/^(?:\+?88)?01[3-9]\d{8}$/, { message: "Invalid phone number (e.g., +8801XXXXXXXX or 01XXXXXXXX)." })
    phone!: string;

    @Column({ type: "varchar", length: 255 })
    @IsEmail()
    resturantemail!: string;

    @Column({ type: "varchar", length: 20 })
    @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/ , { message: "Time must be in 24-hour format (e.g., 13:40 or 09:30)." })
    closing!: string;

    @Column({ type: "boolean", default: false })
    payfirst!: boolean;

    @Column({ type: "uuid", nullable: false })
    ownerid!: string;

    @ManyToOne(() => users, (user) => user.resturants, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'ownerid' })
    owner!: users;

    @Column({ type: "uuid", nullable: true })
    @IsOptional()
    logoFileId?: string;

    @ManyToOne(() => Files, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'logoFileId' })
    logoFile?: Files;

    @Column({ type: "uuid", nullable: true })
    @IsOptional()
    coverFileId?: string;

    @ManyToOne(() => Files, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'coverFileId' })
    coverFile?: Files;

    @OneToMany(() => Files, (file) => file.restaurant)
    files?: Files[];
    
    @OneToMany(() => Tables, (tables) => tables.resturant)
    tables?: Tables[];

    @OneToMany(()=> menu , (menu) => menu.resturent)
    menu?:menu[];

    @OneToOne(() => Wallet, (wallet) => wallet.restaurant)
    wallet?: Wallet;
    
    @CreateDateColumn()
    createdat!: Date;

    @UpdateDateColumn()
    updated!: Date;
}