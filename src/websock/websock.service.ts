import { Injectable } from '@nestjs/common';
import { WebsocketSubscriber } from './websock.types';

@Injectable()
export class Service {
    private readonly subscribers: Map<string, WebsocketSubscriber> = new Map();

    addSubs(subscriber:WebsocketSubscriber){
        this.subscribers.set(subscriber.socketId , subscriber);
    }
    removeSubs(socketId:string):void{
        this.subscribers.delete(socketId);
    }

    // finding the resturent and sending the pulse

    getSubs(resturantId:string , event:string , payload:unknown):void{
        for(const s of this.subscribers.values()){
            if(s.resturantId === resturantId){
                s.socket.emit(event , payload);
            }
        }
    }

}
