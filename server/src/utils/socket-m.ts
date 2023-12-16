import { Server, Socket, Namespace } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { getRedis, verifyToken } from '../utils';
import { saveMessage, getRoomMessages, setMessagesToSeen, seeNotification, countUnseenMessages } from '../services';
import { NotificationManager } from './notification';
import { User } from '../models';

interface CustomSocket extends Socket {
  userId?: string;
}
interface MessageData {
  toID: string;
  messages: {
    messagesIDArray: [];
    messagesFilter: object;
  };
}
export class SocketManager {
  private io: Server;
  private doctorPatient: Namespace;

  constructor(io: Server, url: string) {
    this.io = io;
    this.doctorPatient = io.of(url);

    io.use(this.logRequest);
    this.setUp();
  }

  private logRequest(socket: Socket, next: () => void) {
    console.log(`Received request: ${socket.id}, event: ${socket.eventNames()}, data: ${JSON.stringify(socket.data)} \n the error is ${socket._error}`);
    socket.on('error', (err) => console.error(`Socket.IO connection error for socket ${socket.id}:`, err.message));
    next();
  }

  private async authenticateSocket(socket: CustomSocket, next: (err?: ExtendedError) => void) {
    try {
      const parsedCookies = this.parseCookies(socket.handshake.headers.cookie);
      const token = this.getToken(parsedCookies, socket);
      const decoded = token ? verifyToken(token) : undefined;
      const tokenValid = decoded ? await getRedis((decoded as any ).id) : undefined;

      console.log(token, '\n', decoded, '\n');

      if (tokenValid) {
        socket['userId'] = (decoded as any).id;
        next();
      } else {
        throw new Error('Not Authorized for socket connection');
      }
    } catch (error: any) {
      console.error('Authentication error:', error.message);
      next(error);
    }
  }

  private parseCookies(cookies?: string) {
    return cookies?.split(';').reduce((acc: any, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
  }

  private getToken(parsedCookies: any, socket: CustomSocket) {
    return parsedCookies?.['token'] || socket.handshake.auth.token || socket.handshake.query.token;
  }

  private createRoomName(user1: string, user2: string) {
    return user1 < user2 ? `${user1}-${user2}` : `${user2}-${user1}`;
  }

  setUp() {
    this.doctorPatient.use(this.authenticateSocket.bind(this));
    this.doctorPatient.on('connection', (socket: CustomSocket) => {
      socket.on('joinRoom', this.handleJoinRoom.bind(this, socket));
      socket.on('leaveRoom', this.handleLeaveRoom.bind(this, socket));
      socket.on('chatMessage', this.handleChatMessage.bind(this, socket));
      socket.on('setSeen', this.handleSetSeen.bind(this, socket));
      socket.on('unSeenCount', this.handleUnSeenCount.bind(this, socket));
    });
  }

  private async handleJoinRoom(socket: CustomSocket, data: any) {
    const roomName = this.createRoomName(socket.userId!, data.toID);
    await socket.join(roomName);
    console.log(`${socket.userId} joined room: ${roomName}`);
  }

  private async handleLeaveRoom(socket: CustomSocket, data: any) {
    const roomName = this.createRoomName(socket.userId!, data.toID);
    await socket.leave(roomName);
    console.log(`${socket.userId} left room: ${roomName}`);
  }

  private async handleChatMessage(socket: CustomSocket, data: any) {
    const roomName = this.createRoomName(socket.userId!, data.toID);
    const MID = await saveMessage(socket.userId!, data.toID, data.content);
    this.doctorPatient.in(roomName).except(socket.id).emit('chatMessage', { ...data, _id: MID });
    const name: string = (await User.findById(socket.userId!).select('name'))!.name;
    await NotificationManager.notify(data.toID, 'Message', data.content, name);
    console.log(`Message sent to room: ${roomName} ${JSON.stringify(data)}`);
  }

  private async handleSetSeen(socket: CustomSocket, data: MessageData) {
    console.log("9989", data, "4vf5v");
  try {
    await setMessagesToSeen(socket.userId!, data.toID, data.messages.messagesIDArray);

    const filter: object = {
      $or: [{ isSeen: false, type: 'Message', ...data.messages.messagesFilter }]
    };

    await seeNotification(filter);
    await NotificationManager.triggerUpdate(socket.userId!);
  } catch (error) {
    console.error('Error in handleSetSeen:', error);
  }
}
  private async handleUnSeenCount(socket: CustomSocket, data: any) { 
    console.log(JSON.stringify(data),socket.userId);
    let countMap: { [key: string]: number } = {};
    for (const otherID of data.others) {
        const count: number = (await countUnseenMessages(socket.userId!, otherID)).count;
        countMap[otherID] = count;
    }
    this.doctorPatient.to(socket.id).emit('unSeenCount', { countMap });
}
}