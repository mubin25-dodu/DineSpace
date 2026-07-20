import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from "nodemailer"
import { emailDto } from './DTO/Email.dto';
import { Result } from 'src/SharedServices/Result';

@Injectable()
export class MailService {

    constructor(private readonly configenv:ConfigService){}
    async emailTransport(){
        const transport = await nodemailer.createTransport({
            host: this.configenv.get<string>("emailhost"),
            port: this.configenv.get<number>("emailport"),
            secure: false,
            auth:{
                user:this.configenv.get<string>("emailuser"),
                pass:this.configenv.get<string>("emailpass")
            }
        });
        // console.log(transport);
        return transport;
    }

    async sendmail(email:emailDto):Promise<Result<string>>{

        const result = new Result<string>;
        const start = Date.now();
        try{
        const {recipients ,subject , html } = email ;
        const transportStart = Date.now();
        const transport = await this.emailTransport();
        console.log('transport creation time', Date.now() - transportStart);

        const options:nodemailer.SendMailOptions={
            from:this.configenv.get<string>("emailuser"),
            to:recipients,
            subject:subject,
            html:html,
        }

        const sendStart = Date.now();
        transport.sendMail(options);
        console.log('sendMail time', Date.now() - sendStart);

        result.Data = "";
        result.Message = "mail send...";
        console.log('total email time', Date.now() - start);

        }catch(e){
            result.Data = "";
            result.Success = false;
            result.Message = String(e);
            console.log('email send failed after', Date.now() - start, e);
        }

        return result;
    }
}
