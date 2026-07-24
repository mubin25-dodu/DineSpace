import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TableStatus } from '../Enum/tablestatus.enum';

@Entity('tables')
export class Tables {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({type:"int" , nullable:false})
  tableno!:number;

  @Column({ type: "enum",enum:TableStatus , nullable: false })
  status!: TableStatus;

  @Column({ type: 'uuid', nullable: true })
  orderId?: string;

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

//   @Column({ type: 'int', nullable: true })
//   logId?: number;
}
