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
        const normalizedRestaurantId = String(resturantId);
        let matched = 0;
        for(const s of this.subscribers.values()){
            if(String(s.resturantId) === normalizedRestaurantId){
                s.socket.emit(event , payload);
                matched += 1;
                console.log(`Event ${event} sent to socket ${s.socketId} for restaurant ${normalizedRestaurantId}`);
            }
        }
        if (matched === 0) {
            console.warn(
                `No subscribers found for restaurant ${normalizedRestaurantId}. ` +
                `Active subscriptions: ${Array.from(this.subscribers.values())
                    .map((subscriber) => subscriber.resturantId)
                    .join(', ') || 'none'}`,
            );
        }
    }

}
