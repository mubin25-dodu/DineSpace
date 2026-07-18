import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from "nodemailer"
import { emailDto } from './DTO/Email.dto';
import { Result } from 'src/SharedServices/Result';

@Injectable()
export class MailService {

    constructor(private readonly configenv:ConfigService){}
    emailTransport(){
        const transport = nodemailer.createTransport({
            host: this.configenv.get<string>("emailhost"),
            port: this.configenv.get<number>("emailport"),
            secure: false,
            auth:{
                user:this.configenv.get<string>("emailuser"),
                pass:this.configenv.get<string>("emailpass")
            }
        });
        console.log(transport);
        return transport;
    }

    async sendmail(email:emailDto):Promise<Result<string>>{

        const result = new Result<string>;
        try{
        const {recipients ,subject , html } = email ;
        const transport = this.emailTransport();
        const options:nodemailer.SendMailOptions={
            from:this.configenv.get<string>("emailuser"),
            to:recipients,
            subject:subject,
            html:html,
        }
            await transport.sendMail(options);
            result.Data = "";
            result.Message = "mail send...";

        }catch(e){
            result.Data = "";
            result.Success = false;
            result.Message = String(e);
        }
        return result;
    }
}
