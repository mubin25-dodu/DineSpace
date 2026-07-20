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
        const create = await this.repo.save(data);
        if(!create){
            result.Message = "could not create verification request";
            result.Success = false;
            return result;
        }

        const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
        await this.mailService.sendmail({
            recipients:[data.targetValue],
            subject:"Verification Request",
            html:`<p>Your verification request has been created. Please click the link to verify the mail <br> Your verification request has been created. Please click the link to verify the mail ${frontendUrl}?verification-request/verify/${data.token}</p>`,
            text:[`Your verification request has been created. Please click the link to verify the mail ${frontendUrl}?verification-request/verify/${data.token}`]
        })
    }
    catch(e){
        result.Data= data;
        result.Message = String(e);
        result.Success = false;
    }
        return result;

    }

    async verifyToken(token:string):Promise<Result<string | null>>{
    
        const result = new Result<string | null>();
        
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
 
    //  EMAIL_CHANGE = 'EMAIL_CHANGE',
        if(checktoken.type == "EMAIL_CHANGE"){
            const change = await this.userservice.Updateuser(checktoken.userId , checktoken.targetValue);
            if (!change.Success){
                result.Message = change.Message;
                result.Success = false ;
                return result;
            }
            checktoken.attempts = (checktoken.attempts || 0) + 1;
            checktoken.usedAt = new Date();
            await this.repo.save(checktoken);
            result.Message = "Email changed successfully";
            return result;
        }
    // PHONE_CHANGE = 'PHONE_CHANGE',
    // EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
    // PASSWORD_RESET = 'PASSWORD_RESET',
        
    }
    catch(e){
        result.Message = String(e);
        result.Success = false;
    }
        return result;

    }
        
}
