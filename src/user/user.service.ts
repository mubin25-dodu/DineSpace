import { Injectable, UseGuards } from '@nestjs/common';
import { Result } from 'src/SharedServices/Result';
import { Repository } from 'typeorm';
import { UserDto } from './DTO/User.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { users } from './Entity/users.entity';
import { PartialUserDto } from './DTO/partialUser.dto';
import * as bcrypt from 'bcrypt';


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

    async FIndbyemail(email):Promise<Result<users>>{
        const result = new Result<users>;
    try{
        const getuser = await this.userrepo.findOne({where:{email:email}, select:{password:false , id:true , email:true
        }}); 
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

    async UpdateEmail( user:any,updateuser:PartialUserDto):Promise<Result<PartialUserDto>>{
        const result = new Result<PartialUserDto>();
    try{
        const check = await this.FIndbyemail(updateuser.email);
        if(check.Success){
        result.Message ="Email Already in use";
        result.Success = false;
        return result;
        }

        const finduser = await this.userrepo.findOne({where:{id:user.userId}});
        if(updateuser.password == undefined || updateuser.password == null){
            result.Message ="Password is required to update email";
            result.Success = false;
            return result;
        }
        const compare = await bcrypt.compare(updateuser.password! , finduser!.password);

        if(!compare){
            result.Message ="Wrong Password";
            result.Success = false;
            return result;
        }

        const create = await this.userrepo.update({id:user.userId}, {email: updateuser.email}); 
        if(create.affected == 1){
            result.Message ="User updated";
            return result;
        }
        result.Message ="User Not found";
        result.Success = false;
    }
    catch(e){
        result.Data= updateuser;
        result.Message = String(e);
        result.Success = false;
    }
        return result;

    }
    async UpdatePassword( user:any, updateuser:PartialUserDto):Promise<Result<PartialUserDto>>{
        const result = new Result<PartialUserDto>();
    try{
         const hashpassword = await bcrypt.hash(updateuser.password! , 10);
         updateuser.password = hashpassword;

        const create = await this.userrepo.update({id:user.userId} , {password: updateuser.password}); 
        if(create.affected == 1){
            result.Message ="password updated";
            return result;
        }
        result.Message ="User Not found";
        result.Success = false;
    }
    catch(e){
        result.Data= updateuser;
        result.Message = String(e);
        result.Success = false;
    }
        return result;

    }
}
