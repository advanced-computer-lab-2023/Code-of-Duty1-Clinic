import mongoose from 'mongoose';
import config from '../config/DB&ServerConfig';
import app from './server';
import { Server } from 'socket.io';
import { SocketManager } from './utils/socket-m';
import { NotificationManager } from './utils/notification';
console.log(config.DB.URL.toString());

let expressServer: any;
let io: Server;

mongoose
  .connect(config.DB.URL.toString(), {
    useNewUrlParser: true,
    writeConcern: {
      retryWrites: true
    }
  } as mongoose.MongooseOptions)
  .then(() => console.log('Connected successfully to mongoDB server\n'))
  .then(() => {
    expressServer = app.listen(config.server.PORT, () =>
      console.log(`Server started on http://localhost:${config.server.PORT}`)
    );
    io = new Server(expressServer, {
      cors: {
        origin: 'http://localhost:3030',
        credentials: true,
        methods: ['GET', 'POST']
      }
    });
    const DoctorPatientSocket = new SocketManager(io, '/chat/doctor/patient');
    const pharmacistPatientSocket = new SocketManager(io, '/chat/pharmacist/patient');
    const notificationSocket = new NotificationManager(io, '/notification');
  })
  .catch((err) => console.log(err.message));

export { io };
