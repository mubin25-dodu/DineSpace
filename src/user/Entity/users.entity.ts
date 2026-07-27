import { Files } from "src/files/Entity/Files.Entity";
import { Resturant } from "src/resturant/Entity/Resturant.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class users {
    @Column({ unique: true, type: "varchar", length: 255 })
    email!: string;

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @Column({ type: "varchar", length: 10 , default:"owner" })
    role?: string;

    @OneToMany(() => Resturant, (restaurant) => restaurant.owner)
    resturants?: Resturant[];

    @OneToMany(() => Files, (file) => file.uploadedByUser)
    files?: Files[];
}