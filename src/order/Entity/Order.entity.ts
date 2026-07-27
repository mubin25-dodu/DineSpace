import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/OrderStatus.enum";
import { OrderedItems } from "./OrdredItems.entity";
import { Tables } from "src/tables/Entity/Tables.entity";
import { Payment } from "src/payment/Entity/payment.entity";

@Entity()
export class Order{
    @PrimaryColumn()
    id!:string;

    @Column({type:"uuid", nullable:false})
    tableId!:string;

    @OneToOne(() => Tables, (table) => table.order)
    table?: Tables;

    @OneToMany(() => OrderedItems, (items) => items.order)
    orderitems!:OrderedItems[];

    @Column({type:"decimal", nullable:false , precision: 10,
    scale: 2})
    payable!:number;

    @Column({type:"decimal", nullable:true , precision: 10,
    scale: 2})
    discount?:number;
    
    @Column({type:"enum",enum:OrderStatus, nullable:false })
    OrderstStatus!:OrderStatus;

    @Column({type:"timestamp", nullable:true})
    DeliveryTime?:Date;

    @Column({type:"varchar", nullable:false, length:255})
    customerName!:string;

    @Column({type:"varchar", nullable:false})
    customerPhone!:number;
    
    @OneToOne(() => Payment, (payment) => payment.order)
    payment?: Payment;

    @CreateDateColumn()
    OrderTime!:Date;
}