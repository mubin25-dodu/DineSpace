import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { OrderStatus } from "../enum/OrderStatus.enum";
import { OrderedItems } from "./OrdredItems.entity";
import { Tables } from "src/tables/Entity/Tables.entity";
import { Payment } from "src/payment/Entity/payment.entity";
import { AddOnOrder } from "./AddOnOrder.entity";

@Entity()
export class Order{
    @PrimaryColumn()
    id!:string;

    @Column({type:"uuid", nullable:false})
    tableId!:string;

    @ManyToOne(() => Tables, (table) => table.orders, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "tableId", referencedColumnName: "id" })
    table?: Tables;

    @OneToMany(() => OrderedItems, (items) => items.order)
    orderitems!:OrderedItems[];

    @OneToMany(() => AddOnOrder, (addOnOrder) => addOnOrder.order)
    addOnOrders?: AddOnOrder[];

    @Column({type:"decimal", nullable:false , precision: 10,
    scale: 2})
    payable!:number;

    @Column({type:"decimal", nullable:true , precision: 10,
    scale: 2})
    discount?:number;
    
    @Column({type:"enum",enum:OrderStatus, nullable:false })
    OrderStatus!:OrderStatus;

    @Column({type:"timestamp", nullable:true})
    DeliveryTime?:Date;

    @Column({type:"varchar", nullable:false, length:255})
    customerName!:string;

    @Column({type:"varchar", nullable:false})
    customerPhone!:number;

    @Column({type:"varchar", nullable:true, length:255})
    customerEmail?:string;
    
    @OneToOne(() => Payment, (payment) => payment.order)
    payment?: Payment;

    @CreateDateColumn()
    OrderTime!:Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
}