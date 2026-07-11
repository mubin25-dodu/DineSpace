import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { varification } from '../Database/Entity/verification.entity';
import { EntityManager, Repository } from 'typeorm';
import { loginPartialDto } from './DTO/PartialLogin.dto';
import { Result } from 'src/SharedServices/Result';
import { randomUUID } from 'crypto';
import { RegistrationDto } from './DTO/Registration.Dto';
import { users } from 'src/Database/Entity/users.entity';
import { UserService } from 'src/user/user.service';
import { Resturant } from 'src/Database/Entity/Resturant.entity';

@Injectable()
export class AuthService {
    constructor( private DbContext:EntityManager , private jwt:JwtService  , private userService: UserService){}

    async mailverification(data:loginPartialDto) : Promise<Result<loginPartialDto>>{
        //send a mail with the otp 
        const result = new Result<loginPartialDto>
        try{
                const create = await this.DbContext.save(varification , {email:data.email , uid: randomUUID()}); 
                if(create){
                    //sending mail methode will be added here 
                    // sendmail();
                    result.Message="Mail send";
                    result.Data = data;
                    return result;
                }
                    result.Message="Could'nt send mail try again";
                    result.Data = data;
                    result.Success = false;
                    return result;
        }catch(e){
            result.Success = false;
            result.Data = data;
            result.Message = String(e);
        }
        return result;
    }

    async register( uid:string , data:RegistrationDto):Promise<Result<RegistrationDto>>{
        const result = new Result<RegistrationDto>;
        try{
            const checkuid = await this.DbContext.findOne(varification,{where:{uid:uid}});
            if(checkuid != null){
                const check = await this.DbContext.findOne(users,{where:{email:data.email}});
                if(!check){
                    const resturant = await this.DbContext.save(Resturant , {resturantName:data.resturantName  , address:data.address , phone:data.phone 
                        , email:data.Resturantemail , opening:data.opening , closing:data.closing , isopen:data.isopen ,payfirst:data.payfirst});
                    if(resturant){
                    const userpayload = this.DbContext.create(users , {
                        email:data.email,
                        role:"users",
                        //will hash letter
                        password:data.password,
                      resturantid: resturant.id
                    });
                    const check = await this.userService.adduser(userpayload);
                    
                    if(check.Success){
                        this.DbContext.remove(varification,checkuid)
                        result.Data = data;
                        result.Message = "User Registered";
                        return result;
                    }
                    result.Success = false;
                    result.Message = "Could'nt register user";
                    result.Data = data;
                    return result;
                }
            }
                    result.Success = false;
                    result.Message = "User already exixts";
                    result.Data = data;
                    return result;
            }else{
                result.Success= false;
                result.Message = "Register Your email First"
                result.Data = data;
            }
            return result;
        }catch(e){
            result.Success = false;
            result.Data = data;
            result.Message = String(e);
        }
        return result;
    }

    login( username:string , password:string){
        return this.jwt.sign({username:username , password: password});
    }
}
