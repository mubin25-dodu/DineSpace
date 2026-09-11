import { Socket } from "socket.io";
export class WebsocketSubscriber {
  socketId!: string;
  userId!: string;
  resturantId?: string;
  socket!: Socket;
}