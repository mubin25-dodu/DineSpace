import { Column, Entity, PrimaryColumn } from "typeorm"
@Entity()
export class users{
    @PrimaryColumn({ type: "varchar", length: 255 })
    email!:string;
    @Column({ type: "varchar", length: 255 })
    resturantid!:string;
    @Column({ type: "varchar", length: 255 })
    password!:string;
    @Column({ type: "varchar", length: 10 })
    role!:string;
}