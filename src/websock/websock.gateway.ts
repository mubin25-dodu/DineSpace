import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Service } from './websock.service';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
}
