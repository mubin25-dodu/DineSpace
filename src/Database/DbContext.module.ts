import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { users } from "./Entity/users.entity";
import { varification } from "./Entity/verification.entity";
import { Resturant } from "./Entity/Resturant.entity";

@Global()
@Module({

    imports:[TypeOrmModule.forFeature([users, varification , Resturant])] ,
    exports:[TypeOrmModule]

})
export class DatabaseModule{}