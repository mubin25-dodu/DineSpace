import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentStatus } from "../Enum/PaymentStatus.enum";
import { paymentMethod } from "../Enum/PaymentMethode.enum";
import { Order } from "src/order/Entity/Order.entity";

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

    @Column({type:"int" , nullable:true})
    acountNumber?:string;

    @Column({type:"uuid"})
    orderId?:string;

    @OneToOne(() => Order, (order) => order.payment)
    order?: Order;
}