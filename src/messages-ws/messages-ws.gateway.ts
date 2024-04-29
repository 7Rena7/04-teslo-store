import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/users/interfaces';

@WebSocketGateway({ cors: true, namespace: 'messages' })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    console.log(
      'On Handle Connection - Connected clients:',
      this.messagesWsService.getConnectedClients().length,
    );
    this.server.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.unregisterClient(client.id);
    console.log(
      'On Handle Disconnection - Connected clients:',
      this.messagesWsService.getConnectedClients().length,
    );
    this.server.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(`Message from client ${client.id}: ${payload.content}`);
    this.server.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      clientId: client.id,
      message: payload.content,
    });
  }
}
