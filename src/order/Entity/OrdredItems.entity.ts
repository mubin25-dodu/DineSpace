import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order.entity";
import { menu } from "src/menu/Entity/menu.entity";
import { AddOnOrder } from "./AddOnOrder.entity";

@Entity()
export class OrderedItems{
    @PrimaryGeneratedColumn("uuid")
    id!:string;

    @Column({type:"uuid" , nullable:true })
    orderId?:string;

    @Column({type:"uuid", nullable:true })
    addOnOrderId?:string;

    @ManyToOne(() => Order, (order) => order.orderitems, { onDelete: "CASCADE" })
    @JoinColumn({ name: "orderId" })
    order!: Order;

    @ManyToOne(() => AddOnOrder, (addOnOrder) => addOnOrder.addOnOrderItems, { nullable:true, onDelete: "CASCADE" })
    @JoinColumn({ name: "addOnOrderId" })
    addOnOrder?: AddOnOrder;
    
    @Column({type:"uuid", nullable:false })
    itemId!:string;
    
    @Column({type:"int" , nullable:false })
    quantity!:number;

    @Column({type:"decimal" , nullable:false , precision:10 , scale:2})
    price!:number;

    @ManyToOne(() => menu, (m) => m.orderItems, { onDelete: "CASCADE" })
    @JoinColumn({name:"itemId"})
    menu!:menu;
}