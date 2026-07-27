import { ApiProperty } from "@nestjs/swagger";
import { Files } from "src/files/Entity/Files.Entity";
import { Order } from "src/order/Entity/Order.entity";
import { Resturant } from "src/resturant/Entity/Resturant.entity";
import { ResturantService } from "src/resturant/resturant.service";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class menu{
    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @Column({ type: 'uuid', nullable: false })
    resturentId!: string;
    
    @Column({type:'varchar' , nullable:false , length:255 })
    itemName!:string;
    
    @Column({type:'decimal' , nullable:false })
    price!:number;

    @Column({type:'varchar' , nullable:true , length:255 })
    description!:string;
    @Column({type:'boolean' , nullable:false })
    isAvailable!:boolean;
    
    @Column({type:'varchar' , nullable:false , length:255 })
    catagory!:string;

    @OneToMany(() => Files, (file) => file.Menu)
    images?: Files[];

    @ManyToOne(()=> Resturant , (rest)=>rest.menu ,{
        nullable:false,
        onDelete:"CASCADE"
    } )
    @JoinColumn({name:"resturentId"})
    resturent!:Resturant;

    @OneToMany(() => Order, (order) => order.orderitems)
    order?: Order[];


}