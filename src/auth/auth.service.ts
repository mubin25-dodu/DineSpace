import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { varification } from '../Database/Entity/verification.entity';
import { EntityManager, Repository } from 'typeorm';
import { loginPartialDto } from './DTO/PartialLogin.dto';
import { Result } from 'src/SharedServices/Result';
import { randomUUID } from 'crypto';
import { RegistrationDto } from './DTO/Registration.Dto';
import { UserService } from 'src/user/user.service';
import { ResturantService } from 'src/resturant/resturant.service';
import { loginDto } from './DTO/Login.Dto';

@Injectable()
export class AuthService {
    constructor( private DbContext:EntityManager , private jwt:JwtService  , private userService: UserService , private ResturantService:ResturantService){}

    async mailverification(data:loginPartialDto) : Promise<Result<loginPartialDto>>{

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
                const checkuser = await this.userService.FIndbyemail(data.email);
                if(!checkuser.Success){
                    const resturant = await this.ResturantService.addresturant({ resturantName:data.resturantName  , address:data.address , phone:data.phone 
                        , email:data.Resturantemail , opening:data.opening , closing:data.closing , isopen:data.isopen ,payfirst:data.payfirst});
                    if(resturant.Success){
                    const check = await this.userService.adduser({
                        email:data.email,
                        role:"users",
                        //will hash letter
                        password:data.password,
                        resturantid: resturant.Data?.id ?? ""
                    });
                    
                    if(check.Success){
                        this.DbContext.remove(varification,checkuid)
                        result.Data = data;
                        result.Message = "User Registered";
                        return result;
                    }
                    result.Success = false;
                    result.Message = check.Message;
                    result.Data = data;
                    return result;
                }
                    result.Success = false;
                    result.Message = resturant.Message;
                    result.Data = data;
                    return result;
            }
                    result.Success = false;
                    result.Message = checkuser.Message;
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

    async login(data:loginDto):Promise<Result<loginDto>>{
        const result = new Result<loginDto>
        try{
           const getuser = await this.userService.FIndbyemail(data.email);
                if(getuser.Success){
                    if(getuser.Data?.password !== data.password){
                        result.Message = "Wrong Password";
                        result.Success = false;
                        result.Data = data;
                        return result;
                    }

                    result.Message = "Success";
                    result.Data = data;
                    result.Success = true;
                    return result;
                }
                    result.Message="User Not Found";
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
}
