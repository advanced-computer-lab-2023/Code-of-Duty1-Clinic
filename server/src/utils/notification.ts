import { Server, Socket, Namespace } from 'socket.io';
import { deleteNotification, pushNotification, seeNotification, getNotifications } from '../services';
import { INotification } from '../models';

export class NotificationManager {
  private io: Server;
  private static notification: Namespace;
  // private usersRooms: Set<string>;

  constructor(io: Server, url: string) {
    this.io = io;
    NotificationManager.notification = this.io.of(url);
    // this.usersRooms = new Set();
    this.setUp();
  }

  private setUp() {
    NotificationManager.notification.on('connection', (socket: Socket) => {
      console.log('Notification connected');

      socket.on('disconnect', () => {
        console.log('Notification disconnected');
      });

      socket.on('joinNotificationRoom', async (data: any) => {
        console.log('subscribe', data.userID);
        // this.usersRooms.add(data.userID);
        await socket.join(data.userID);
      });

      socket.on('notification', async (data: any) => {
        // console.log(data,"848484888");
        for (const singleNotification of data) {
          // Assuming that singleNotification is an object with an '_id' property
          await seeNotification({ _id: singleNotification._id });
        }
      });
      socket.on('update', () => {
        // console.log('update', this.usersRooms);
      });

      socket.on('deleteNotification', async (data: any) => {
        deleteNotification(data._id);
      });
    });
  }

  public static async notify(userID: string, type: string, message: string, title: string, date?: Date) {
    const newNotification = await pushNotification({
      userID: userID,
      type: type,
      content: message,
      title: title
    });
    NotificationManager.notification.in(userID).emit('notification', newNotification);
  }
  public static async triggerUpdate(userID: string) {
    NotificationManager.notification.in(userID).emit('update');
  }
}
