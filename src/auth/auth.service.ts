import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { loginPartialDto } from './DTO/PartialLogin.dto';
import { Result } from 'src/SharedServices/Result';
import { randomUUID } from 'crypto';
import { RegistrationDto } from './DTO/Registration.Dto';
import { UserService } from 'src/user/user.service';
import { ResturantService } from 'src/resturant/resturant.service';
import { loginDto } from './DTO/Login.Dto';
import { InjectRepository } from '@nestjs/typeorm';
import { varification } from './Entity/verification.entity';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor( @InjectRepository(varification) private readonly varRepo:Repository<varification> , private jwt:JwtService 
    ,private readonly mailservice:MailService , private userService: UserService , private ResturantService:ResturantService){}

    async mailverification(data:loginPartialDto) : Promise<Result<loginPartialDto>>{

        const result = new Result<loginPartialDto>
        try{
                if(!data.email){
                    result.Success = false;
                    result.Message = 'Email is required';
                    result.Data = data;
                    return result;
                }
                if((await this.userService.FIndbyemail(data.email)).Success){
                    result.Message = "the email is already registred as a user"
                    result.Success = false;
                    return result;
                }
                if((await this.ResturantService.Findbyemail(data.email)).Success){
                    result.Message = "the email is already registred as a resturent"
                    result.Success = false;
                    return result;
                }
                const create = await this.varRepo.save({email:data.email , uid: randomUUID()}); 
                if(create){
                    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
                    const verificationLink = `${frontendUrl}/auth/register/${create.uid}`;
                    const obj = {
                            recipients:[data.email],
                            subject:"Verify Your Mail For DiseSpace",
                            html:`
                                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; padding: 24px; background-color: #f6f7fb;">
                                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
                                        <h2 style="margin-top: 0; color: #111827;">Verify your email address</h2>
                                        <p>Thank you for requesting registration for DineSpace.</p>
                                        <p>Click the button below to continue your registration:</p>
                                        <p style="margin: 32px 0;">
                                            <a href="${verificationLink}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600;">Click here to register</a>
                                        </p>
                                        ${verificationLink}
                                        <p>If you have not requested this, just ignore this email.</p>
                                    </div>
                                </div>
                            `,
                            text:[
                                `Click here to register: ${verificationLink}`,
                                'If you have not requested this, just ignore this email.'
                            ],
                    }
                    await this.mailservice.sendmail(obj);
                   result.Message="mail send...";
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
            const checkuid = await this.varRepo.findOne({where:{uid:uid , email:data.email}});
            if(checkuid != null){
                const hashpassword = await bcrypt.hash(data.password , 10);
                data.password = hashpassword;
                
                const adduser = await this.userService.adduser(data);
                if(adduser.Success){
                   await this.varRepo.remove(checkuid);
                    data.ownerid = adduser.Data!.id || '';
                    const resturant = await this.ResturantService.addresturant(data);
                    if(resturant.Success){
                        result.Data = data;
                        result.Message = "User and resturant Registered";
                        return result;
                    }
                    result.Success = false;
                    result.Message = "User Created Succesfully Could Not Create the resturant Email already exists";
                    result.Data = data;
                    return result;
                }
                    result.Success = false;
                    result.Message = adduser.Message;
                    result.Data = data;
                    return result;
            }else{
                result.Success= false;
                result.Message = "Register Your email First or enter the right email"
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

    async login(data:loginDto): Promise<string | Result<loginDto>> {
        const result = new Result<loginDto> 
        try{
           const getuser = await this.userService.FIndbyemail(data.email);
                if(getuser.Success){
                    const storedHash = getuser.Data?.password;
                    if(!storedHash){
                        result.Message = "User password not available";
                        result.Success = false;
                        result.Data = data;
                        return result;
                    }

                    const isvalidpass = await bcrypt.compare(
                        data.password,
                        storedHash,
                    );

                    if(!isvalidpass){
                        result.Message = "Wrong Password";
                        result.Success = false;
                        result.Data = data;
                        return result;
                    }
                    const userpayload = {
                        id:getuser.Data?.id,
                        email:getuser.Data?.email,
                        role:getuser.Data?.role
                    }
                    result.Message = "Success";
                    result.tocken = this.jwt.sign(userpayload);
                    result.Success = true;
                    return result;
                }
                    result.Message = getuser.Message;
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
