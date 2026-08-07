import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order.entity";

@Entity()
export class OrderedItems{
    @PrimaryGeneratedColumn("uuid")
    id!:string;

    @Column({type:"uuid" , nullable:false })
    orderId!:string;

    @ManyToOne(() => Order, (order) => order.orderitems, { onDelete: "CASCADE" })
    @JoinColumn({ name: "orderId" })
    order!: Order;
    
    @Column({type:"uuid", nullable:false })
    itemId!:string;
    
    @Column({type:"int" , nullable:false })
    quantity!:number;

    @Column({type:"decimal" , nullable:false , precision:10 , scale:2})
    price!:number;
}