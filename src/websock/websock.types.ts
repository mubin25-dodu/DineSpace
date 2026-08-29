import { Socket } from "socket.io";
export class WebsocketSubscriber{
    userId!:string;
    resturantId?:string;
    socket!:Socket;
}