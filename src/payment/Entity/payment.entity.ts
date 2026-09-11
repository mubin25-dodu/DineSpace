import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentStatus } from "../Enum/PaymentStatus.enum";
import { paymentMethod } from "../Enum/PaymentMethode.enum";
import { Order } from "src/order/Entity/Order.entity";
import { Wallet } from "src/wallet/Entity/wallet.entity";
import { AddOnOrder } from "src/order/Entity/AddOnOrder.entity";

@Entity()
export class Payment{
    @PrimaryGeneratedColumn("uuid")
    id!:string;

    @Column({type:'enum',enum:PaymentStatus, nullable:false, default:PaymentStatus.Pending})
    status!:PaymentStatus;

    @Column({type:"enum" , enum:paymentMethod , nullable:false , default:paymentMethod.Cash })
    paymentMethode!:paymentMethod;

    @Column({type:"varchar" , nullable:true})
    transectionId?:string;

    @Column({type:"varchar" , nullable:true})
    acountNumber!:string;

    @Column({type:"decimal", nullable:false , precision: 10,
    scale: 2})
    amount!:number;

    @Column({type:"uuid" , nullable:true})
    orderId?:string;

    @Column({ type: "uuid", nullable: true })
    addOnOrderId?: string;

    @Column({ type: "uuid", nullable: true })
    walletId?: string;

    @OneToOne(() => Order, (order) => order.payment, {onDelete:"SET NULL"} )
    @JoinColumn({name:"orderId" })
    order?: Order;

    @OneToOne(() => AddOnOrder, (addOnOrder) => addOnOrder.payment , {onDelete:"SET NULL"})
    @JoinColumn({ name: "addOnOrderId" })
    addOnOrder?: AddOnOrder;

    @ManyToOne(() => Wallet, (wallet) => wallet.payments, {
        nullable: true,
        onDelete: "SET NULL",
    })
    @JoinColumn({ name: "walletId" })
    wallet?: Wallet;

    @Column({type:Date , default: new Date()})
    createdat!:Date;
}