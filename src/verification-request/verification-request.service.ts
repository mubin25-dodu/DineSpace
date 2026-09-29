import { Injectable, Req, Inject, forwardRef } from '@nestjs/common';
import { CreateVerificationRequestDto } from './DTO/VerificationRequest.Dto';
import { Result } from 'src/SharedServices/Result';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationRequest } from './entity/VerificationRequest.entity';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { randomUUID } from 'crypto';
import { UserService } from 'src/user/user.service';
import { VerificationType } from './Enum/verification-type.enum';

@Injectable()
export class VerificationRequestService {
    constructor(@InjectRepository(VerificationRequest) private readonly repo:Repository<VerificationRequest> 
    , private readonly config:ConfigService , private  mailService: MailService ,
    @Inject(forwardRef(() => UserService)) private userservice:UserService   
    ){}
    
async createvarification(data:CreateVerificationRequestDto):Promise<Result<CreateVerificationRequestDto>>{
  const result = new Result<CreateVerificationRequestDto>();
  const expiresIn = Number(process.env.VerificationRequestExpireDuration || 1800000 );
  const expiresAt = new Date(Date.now() + expiresIn);
    try{
        data.expiresAt = expiresAt;
        data.token = randomUUID();
        if(data.type == VerificationType.PASSWORD_RESET){
            data.targetValue == "***";
        }
        const create = await this.repo.save(data);
        if(!create){
            result.Message = "could not create verification request";
            result.Success = false;
            return result;
        }

        const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
        
        if(data.type == VerificationType.EMAIL_CHANGE)this.mailService.sendmail({
            recipients:[data.targetValue],
            subject:"Verification Request",
            html:`<p>Your verification request has been created. Please click the link to verify the mail <br> Your verification request has been created. Please click the link to verify the mail ${frontendUrl}/verification-request/email/${data.token}</p>`,
            text:[`Your verification request has been created. Please click the link to verify the mail ${frontendUrl}/verification-request/email/${data.token}`]
        })
        else if(data.type == VerificationType.PASSWORD_RESET)this.mailService.sendmail({
            recipients:[data.targetValue],
            subject:"Verification Request",
            html:`<p>Your verification request has been created. Please click the link to reset your password <br> Your verification request has been created. Please click the link to reset your password ${frontendUrl}/verification-request/password-reset/${data.token}</p>`,
            text:[`Your verification request has been created. Please click the link to reset your password ${frontendUrl}/verification-request/password-reset/${data.token}`]
        })
    }
    catch(e){
        result.Data= data;
        result.Message = String(e);
        result.Success = false;
    }
        return result;

    }

    async verifyToken(token:string ):Promise<Result<string | null >>{
    
        const result = new Result<string | null >();
        
    try{
        const checktoken = await this.repo.findOne({where:{token:token}});
        if(checktoken == null){
            result.Message = "Invalid token";
            result.Success = false;
            return result;
        }
        if( checktoken.expiresAt && checktoken.expiresAt < new Date()){
            result.Message = "Token expired";
            result.Success = false;
            return result;
        }if(checktoken.usedAt){
            result.Message = "Token already used";
            result.Success = false;
            return result;
        }if(checktoken.attempts && checktoken.attempts >= 3){
            result.Message = "Token attempts exceeded";
            result.Success = false;
            return result;
        }
        if(checktoken.type == VerificationType.PASSWORD_RESET){
            const user = await this.userservice.FIndbyid(checktoken.userId);
            if(!user.Success || !user.Data){
                result.Message = "User not found";
                result.Success = false;
                return result;
            }
            result.Data = user.Data.email;
            result.Message = "Token verified successfully";
            result.Success = true;
        } 
    }
    catch(e){
        result.Message = String(e);
        result.Success = false;
    }
        return result;

    }

    async checkexisting( userId:string , type:VerificationType):Promise<Result<VerificationRequest | null>>{
        const result = new Result<VerificationRequest | null>();
        try{
            const check = await this.repo.findOne({where:{userId:userId , type:type}});
            if(!check){
                result.Data = null;
                result.Message = "No existing verification request";
                result.Success = true;
                return result;
            }
            result.Data = check;
            result.Message = "Existing verification request found";
            result.Success = true;
            return result;
        } catch (e) {
            result.Success = false;
            result.Message = String(e);
        }
        return result;
    }

    async resetPassword(token:string, password:string):Promise<Result<string | null >>{
        const result = new Result<string | null >();
        try{
        
            const checktoken = await this.repo.findOne({where:{token:token}});
        if(checktoken == null){
            result.Message = "Invalid token";
            result.Success = false;
            return result;
        }
        if( checktoken.expiresAt && checktoken.expiresAt < new Date()){
            result.Message = "Token expired";
            result.Success = false;
            return result;
        }if(checktoken.usedAt){
            result.Message = "Token already used";
            result.Success = false;
            return result;
        }if(checktoken.attempts && checktoken.attempts >= 3){
            result.Message = "Token attempts exceeded";
            result.Success = false;
            return result;
        }
            const user = await this.userservice.resetPassword(  password ,checktoken.userId);
            // await this.repo.update({id:checktoken.id}, {usedAt: new Date()});
            result.Message = user.Message;
            result.Success = user.Success;
            return result;

        } catch (e) {
            result.Success = false;
            result.Message = String(e);
        }
        return result;
    }
}
    

// EMAIL_CHANGE = 'EMAIL_CHANGE',
        // if(checktoken.type == VerificationType.EMAIL_CHANGE){
        //     const change = await this.userservice.Updateuser(checktoken.userId , checktoken.targetValue);
        //     if (!change.Success){
        //         result.Message = change.Message;
        //         result.Success = false ;
        //         return result;
        //     }
        //     checktoken.attempts = (checktoken.attempts || 0) + 1;
        //     checktoken.usedAt = new Date();
        //     await this.repo.save(checktoken);
        //     result.Message = "Email changed successfully";
        //     return result;
        // }
    // PHONE_CHANGE = 'PHONE_CHANGE',
    // EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
    // PASSWORD_RESET = 'PASSWORD_RESET',