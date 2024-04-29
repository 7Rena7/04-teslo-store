import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: { socket: Socket; user: User };
}

interface Client {
  id: string;
  fullName: string;
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  getConnectedClients(): Client[] {
    const connectedClients = Object.keys(this.connectedClients);
    return connectedClients.map((clientId) => ({
      id: clientId,
      fullName: this.getUserFullName(clientId),
    }));
  }

  async registerClient(client: Socket, userId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User is not active');
    this.checkDuplicateUserConnection(user);
    this.connectedClients[client.id] = { socket: client, user };
  }

  unregisterClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getUserFullName(clientId: string) {
    const user = this.connectedClients[clientId].user;
    return `${user.firstName} ${user.lastName}`;
  }

  private checkDuplicateUserConnection(user: User) {
    for (const cliendId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[cliendId];
      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
