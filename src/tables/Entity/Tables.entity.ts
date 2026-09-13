import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { Order } from 'src/order/Entity/Order.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TableStatus } from '../Enum/tablestatus.enum';

@Entity('tables')
export class Tables {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({type:"int" , nullable:false})
  tableno!:number;

  @Column({ type: "enum",enum:TableStatus , nullable: false })
  status!: TableStatus;

  @Column({ type: 'int', nullable: false })
  seatCapacity!: number;

  @Column({ type: 'varchar', nullable: true })
  reservationId?: string;

  @Column({type:'varchar' , nullable:false})
  resturantid!:string;

  @ManyToOne(() => Resturant, (rest) => rest.tables, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({name:"resturantid"})
  resturant!:Resturant;

  @OneToMany(() => Order, (order) => order.table)
  orders?: Order[];

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

}
