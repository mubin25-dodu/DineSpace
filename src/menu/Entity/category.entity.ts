import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('categories')
@Unique(['name'])
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name!: string;
}