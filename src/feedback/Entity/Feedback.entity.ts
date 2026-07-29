import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("feedback")
export class Feedback {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid", nullable: false })
    orderId!: string;

    @Column({ type: "int", nullable: false })
    rating!: number;

    @Column({ type: "varchar", length: 500, nullable: true })
    comment?: string;

    @CreateDateColumn()
    createdAt!: Date;

}