import { Files } from "src/files/Entity/Files.Entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class menu{
    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @OneToMany(()=> Files , (file)=> file.MenuId)
    files?:Files[];

}