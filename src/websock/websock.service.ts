import { Injectable } from '@nestjs/common';
import { WebsocketSubscriber } from './websock.types';

@Injectable()
export class Service {
    private readonly subscribers: Map<string, WebsocketSubscriber> = new Map();

    addSubs(subscriber:WebsocketSubscriber){
        this.subscribers.set(subscriber.userId , subscriber);
    }
    removeSubs(socketId:string):void{
        this.subscribers.delete(socketId);
    }

    getSubs(resturantId:string , event:string):void{
        for(const s of this.subscribers.values()){
            if(s.resturantId === resturantId){
                s.socket.emit(event);
            }
        }
    }

}
