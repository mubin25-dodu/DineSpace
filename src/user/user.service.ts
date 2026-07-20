import { Injectable, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { Result } from 'src/SharedServices/Result';
import { Repository } from 'typeorm';
import { UserDto } from './DTO/User.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { users } from './Entity/users.entity';
import { PartialUserDto } from './DTO/partialUser.dto';
import * as bcrypt from 'bcrypt';
import { VerificationRequestService } from 'src/verification-request/verification-request.service';
import { VerificationType } from 'src/verification-request/Enum/verification-type.enum';


@Injectable()
export class UserService {
    constructor(@InjectRepository(users) private readonly userrepo:Repository<users>, 
    @Inject(forwardRef(() => VerificationRequestService)) private readonly Verificationservice:VerificationRequestService){}
    
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
        const getuser = await this.userrepo.findOne({
            where:{email:email},
            select:{id:true, email:true, password:true, role:true}
        });
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

        if(updateuser.email == undefined || updateuser.email == null){
            result.Message ="Enter an Email";
            result.Success = false;
            return result;
        }

        const finduser = await this.userrepo.findOne({where:{id:user.userId}});
            if(!finduser){
            result.Message ="user not found";
            result.Success = false;
            return result;
        }
        if(updateuser.password == undefined || updateuser.password == null){
            result.Message ="Password is required to update email";
            result.Success = false;
            return result;
        }
        const compare = await bcrypt.compare(updateuser.password!, finduser!.password);

        if(!compare){
            result.Message ="Wrong Password";
            result.Success = false;
            return result;
        }

        const obj = {
            userId :String(user.userId),
            type: VerificationType.EMAIL_CHANGE,
            targetValue:String(updateuser.email),
            currentemail:user.email,
            attempts:0
        };
        const create = await this.Verificationservice.createvarification(obj); 
        if(create){
            result.Message ="A mail has been sent to you click confirm to change the mail";
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
    async Updateuser(id:string , email:string):Promise<Result<users | null>>{
         const result = new Result<users | null>;
    try{
        
        const find = await this.userrepo.findOne({where:{id:id}}); 
        if(!find){
            result.Message ="User not found";
            result.Success = false;
            return result;
        }
        find.email = email;
        result.Message ="email updated";
        result.Data =  await this.userrepo.save(find);
        return result;
    }
    catch(e){
        result.Data = null;
        result.Message = String(e);
        result.Success = false;

    }
        return result;

    }
    
}
