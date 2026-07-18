import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm"
@Entity()
export class varification{
    @Column()
    @IsEmail()
    @PrimaryColumn()
    email!:string;
    @Column()
    uid!:string ;
    @Column()
    @CreateDateColumn()
    sendAt!:Date;
}