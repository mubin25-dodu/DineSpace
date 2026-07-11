import { Matches } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm"
@Entity()
export class users{
    @PrimaryColumn()
    email:string;
    @Column()
    resturantid:string;
    @Column()
     @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ , 
    { message:"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."})
    password:string;
    @Column()
    role:string;
}