import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { users } from "src/user/Entity/users.entity";
import { Resturant } from "src/resturant/Entity/Resturant.entity";
import { menu } from "src/menu/Entity/menu.entity";

@Entity("files")
export class Files {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    FileName!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    OriginalName!: string;

    @Column({ type: "varchar", length: 500, nullable: false })
    Path!: string;

    @Column({ type: "bigint", nullable: false })
    Size!: number;

    @CreateDateColumn({ type: "timestamp", nullable: false })
    CreatedAt!: Date;

    @Column({ type: "uuid", nullable: false })
    UploadedByUserId!: string;

    @ManyToOne(() => users, (user) => user.files, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "UploadedByUserId" })
    uploadedByUser!: users;

    @Column({ type: "uuid", nullable: true })
    RestaurantId?: string;

    @ManyToOne(() => Resturant, (restaurant) => restaurant.files, {
        nullable: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "RestaurantId" })
    restaurant?: Resturant;

    @Column({ type: "uuid", nullable: true })
    MenuId?: string;

    @ManyToOne(() => menu, (menu) => menu.files)
    @JoinColumn({ name: "MenuId" })
    Menu?: menu;
}