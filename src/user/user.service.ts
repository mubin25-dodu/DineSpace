import { Injectable } from '@nestjs/common';
import { users } from 'src/Database/Entity/users.entity';
import { Result } from 'src/SharedServices/Result';
import { EntityManager } from 'typeorm';
import { PartialUserDto } from './DTO/partialUser.dto';

@Injectable()
export class UserService {
    constructor(private Dbcontext:EntityManager){}
    
    async adduser(user:users):Promise<Result<users>>{
        const result = new Result<users>;
    try{
        const create = await this.Dbcontext.save(users,user); 
        if(create){
            result.Data = user;
            return result;
        }
        result.Success = false;
    }
    catch(e){
        result.Data= user;
        result.Message = String(e);
        result.Success = false;

    }
        return result;

    }


    async FIndbyemail(email):Promise<Result<users>>{
        const result = new Result<users>;
    try{
        const getuser = await this.Dbcontext.findOne(users,{where:{email:email}}); 
        if(getuser){
            result.Data = getuser;
            return result;
        }
        result.Success = false;
    }
    catch(e){
        result.Data = new users();
        result.Message = String(e);
        result.Success = false;

    }
        return result;

    }
}
