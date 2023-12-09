import { Server, Socket, Namespace } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { getRedis, verifyToken } from '../utils';
import { saveMessage, getRoomMessages, setMessagesToSeen, seeNotification } from '../services';
import { NotificationManager } from './notification';
import { User } from '../models';

interface CustomSocket extends Socket {
  userId?: string;
}

export class SocketManager {
  private io: Server;
  private doctorPatient: Namespace;

  constructor(io: Server, url: string) {
    this.io = io;
    this.doctorPatient = io.of(url);

    io.use((socket: Socket, next) => {
      console.log(
        `Received request: ${socket.id}, event: ${socket.eventNames()}, data: ${JSON.stringify(
          socket.data
        )} \n the error is ${socket._error}`
      );
      socket.on('error', (err) => {
        console.error(`Socket.IO connection error for socket ${socket.id}:`, err.message);
      });
      next();
    });
    this.setUp();
  }

  private async authenticateSocket(socket: CustomSocket, next: (err?: ExtendedError) => void) {
    try {
      let cookies: string | undefined = socket.handshake.headers.cookie;

      const parsedCookies = cookies?.split(';').reduce((acc: any, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});

      let token: any = parsedCookies?.['token'] || socket.handshake.auth.token || socket.handshake.query.token;
      const decoded: any = token ? verifyToken(token) : undefined;
      const tokenValid = decoded ? await getRedis(decoded.id) : undefined;
      console.log(token, '\n', decoded, '\n');
      if (tokenValid) {
        socket['userId'] = decoded.id;
        next();
      } else {
        throw new Error('Not Authorized for socket connection');
      }
    } catch (error: any) {
      console.error('Authentication error:', error.message);
      next(error);
    }
  }

  private createRoomName(user1: string, user2: string) {
    return user1 < user2 ? `${user1}-${user2}` : `${user2}-${user1}`;
  }

  setUp() {
    this.doctorPatient.use(this.authenticateSocket);
    this.doctorPatient.on('connection', async (socket: CustomSocket) => {
      socket.on('joinRoom', async (data) => {
        let user1ID: string = socket.userId!;
        let user2ID = data.toID;
        let roomName = this.createRoomName(user1ID, user2ID);
        await socket.join(roomName);

        console.log(`${socket.userId} joined room: ${roomName}`);
      });

      socket.on('leaveRoom', async (data) => {
        let user1ID: string = socket.userId!;
        let user2ID = data.toID;
        let roomName = this.createRoomName(user1ID, user2ID);
        await socket.leave(roomName);

        console.log(`${socket.userId} left room: ${roomName}`);
      });

      socket.on('chatMessage', async (data) => {
        let user1ID: string = socket.userId!;
        let user2ID = data.toID;
        let roomName = this.createRoomName(user1ID, user2ID);
        let MID = await saveMessage(user1ID, user2ID, data.content);
        this.doctorPatient
          .in(roomName)
          .except(socket.id)
          .emit('chatMessage', { ...data, _id: MID });
        let name: string = (await User.findById(user2ID).select('name'))!.name;
        await NotificationManager.notify(user2ID, 'Message', data.content, name);

        console.log(`Message sent to room: ${roomName} ${JSON.stringify(data)}`);
      });
      socket.on('setSeen', async (data) => {
        console.log('in setSeen', data);
        let user1ID: string = socket.userId!;
        let user2ID = data.toID;
        console.log(JSON.stringify(data), 'ffff');
        await setMessagesToSeen(user1ID, user2ID, data.messages);
        console.log(
          await seeNotification({
            userID: user1ID,
            title: data.title,
            content: data.message,
            isSeen: false,
            type: 'Message'
          })
        );
        await NotificationManager.triggerUpdate(user1ID);
      });
    });
  }
}
