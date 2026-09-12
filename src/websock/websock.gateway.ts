import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Service } from './websock.service';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WebsocketSubscriber } from './websock.types';

//learning about websockets in nestjs 

@WebSocketGateway({
  cors:{
    origin:'*'
  }
})

export class WebsockGateway implements OnGatewayConnection , OnGatewayDisconnect{
  constructor(private readonly websock:Service , private readonly configService: ConfigService , private jwt:JwtService){}
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('Received message:', payload);
    return 'Hello world!';
  }
  handleConnection(@ConnectedSocket() socket:Socket):boolean {
    try{
      const token = socket.handshake.auth?.token;
      if(!token){
        console.log("no token found");
        socket.disconnect();
        return false;
      }
      const payload = this.jwt.verify(
        token,{
        secret: this.configService.get<string>('secretjwtkey')!,}) as {
        id: string;
        email: string;
        role: string;
      };

      //saving the payload to letter use in the socket
      // Now the verified JWT data is attached to the socket and can be used by future socket events.

//       Client connects with JWT
//              ↓
//      Backend verifies JWT
//              ↓
//      Backend stores user in socket.data.user
//              ↓
//      Future events can identify the user

      socket.data.user = payload;
      return true;

    }catch(e){
      console.log('WebSocket authentication failed');
      socket.disconnect();
      return false;
    }
  }
  handleDisconnect(@ConnectedSocket() Socket:Socket) {
    this.websock.removeSubs(Socket.id);
    console.log(`client disconnected: ${Socket.id}` );
  }

  @SubscribeMessage('subscribeRestaurant')
 handleSubscribeRestaurant(client: Socket, payload: { resturantId: string }) {
  if (!client.data.user?.id || !payload?.resturantId) {
    return {
      success: false,
      message: 'User and restaurant are required',
    };
  }

  const subscriber : WebsocketSubscriber ={
    socketId:client.id,
    userId: client.data.user.id,
    resturantId:String(payload.resturantId),
    socket:client
  }

  console.log(`Socket ${client.id} subscribed to restaurant ${subscriber.resturantId}`);
  this.websock.addSubs(subscriber);
  return {
  success: true,
  message: 'Subscribed to restaurant',
};
}

}
