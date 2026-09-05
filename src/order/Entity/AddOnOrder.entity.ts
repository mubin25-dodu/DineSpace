import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { OrderStatus } from "../enum/OrderStatus.enum";
import { OrderedItems } from "./OrdredItems.entity";
import { Order } from "./Order.entity";
import { Payment } from "src/payment/Entity/payment.entity";

@Entity()
export class AddOnOrder {
    @PrimaryColumn()
    id!: string;

    @Column({ type: "uuid", nullable: false })
    orderId!: string;

    @ManyToOne(() => Order, (order) => order.addOnOrders, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "orderId", referencedColumnName: "id" })
    order?: Order;

    @OneToMany(() => OrderedItems, (items) => items.addOnOrder)
    addOnOrderItems?: OrderedItems[];

    @Column({ type: "decimal", nullable: false, precision: 10, scale: 2 })
    payable!: number;

    @Column({ type: "decimal", nullable: true, precision: 10, scale: 2 })
    discount?: number;

    @Column({ type: "enum", enum: OrderStatus, nullable: false })
    OrderStatus!: OrderStatus;

    @OneToOne(() => Payment, (payment) => payment.addOnOrder)
    payment!: Payment;

    @CreateDateColumn()
    OrderTime!: Date;
}
