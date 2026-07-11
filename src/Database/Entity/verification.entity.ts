import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
@Entity()
export class varification{
    @Column()
    @IsEmail()
    @PrimaryColumn()
    email:string;
    @Column()
    // @PrimaryGeneratedColumn()
    uid:string ;
    @Column()
    @CreateDateColumn()
    sendAt:Date;
}