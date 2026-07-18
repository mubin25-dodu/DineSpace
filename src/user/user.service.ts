import { Injectable } from '@nestjs/common';
import { Result } from 'src/SharedServices/Result';
import { Repository } from 'typeorm';
import { UserDto } from './DTO/User.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { users } from './Entity/users.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(users) private readonly userrepo:Repository<users>){}
    
    async adduser(user:UserDto):Promise<Result<UserDto>>{
        const result = new Result<UserDto>;
    try{
        if((await this.FIndbyemail(user.email)).Success ) {
            result.Message = "User with this email already exists";
            result.Success = false;
            return result;
        }
        const create = await this.userrepo.save(user); 
        if(create){
            result.Data = create;
            result.Message ="User created";
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


    async FIndbyemail(email):Promise<Result<UserDto>>{
        const result = new Result<UserDto>;
    try{
        const getuser = await this.userrepo.findOne({where:{email:email}}); 
        if(getuser){
            result.Data = getuser;
            return result;
        }
        result.Message ="User not found";
        result.Success = false;
    }
    catch(e){
        result.Message = String(e);
        result.Success = false;

    }
        return result;

    }

    
}
