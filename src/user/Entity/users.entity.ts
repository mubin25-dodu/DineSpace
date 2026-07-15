import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
@Entity()
export class users{
    @Column({ unique:true, type: "varchar", length: 255 })
    email!:string;
    @PrimaryGeneratedColumn('uuid')
    id!:string;
    @Column({ type: "varchar", length: 255 })
    password!:string;
    @Column({ type: "varchar", length: 10 })
    role!:string;
}