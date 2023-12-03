import { Server ,Socket,Namespace } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { getRedis, verifyToken } from '../utils';
import { resolveModuleName } from 'typescript';

console.log("HELLLLL0");
const activeUsers: any = {};
const activeRooms: string[] = [];
interface CustomSocket extends Socket {
    userId?: string;
}

export class SocketManager {
    io: Server;
    doctorPatient: Namespace;

    constructor(io: Server) {
        this.io = io;
        this.doctorPatient = io.of('/chat/doctor/patient');
    }
private async authenticateSocket(socket: CustomSocket, next: (err?: ExtendedError) => void) {
        try {
            let cookies: string | undefined = socket.handshake.headers.cookie;
        
            const parsedCookies = cookies?.split(';').reduce((acc: any, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {});

            let token: any = parsedCookies?.["token"] || socket.handshake.auth.token || socket.handshake.query.token;
            const decoded: any = token ? verifyToken(token) : undefined;
            const tokenValid = decoded ? await getRedis(decoded.id) : undefined;
            
            if (tokenValid) {
                socket["userId"] = decoded;
                next();
            } else {
                throw new Error("Not Authorized for socket connection");
            }
        } catch (error:any) {
            console.error('Authentication error:', error.message);
            next(error);
        }
    }
    
    private isAuthorized() { 

    }
    private createRoomName(user1: string, user2: string) {
        if (user1 < user2)
            return `${user1}-${user2}`;
        return `${user2}-${user1}`;
    }
      checkIfRoomExists = (userOne: string,userTwo: string) => {
       return activeRooms.indexOf(this.createRoomName(userOne,userTwo));
    }
    
    doctorPatientSetup() {
        this.doctorPatient.use(this.authenticateSocket);
        this.doctorPatient.on('connection', (socket: CustomSocket) => {
                socket.on('joinRoom', (data) => {
                    let user1ID :string = socket.userId!;
                    let user2ID = data.toID;
                    if (this.checkIfRoomExists(user1ID, user2ID)==-1) {
                        let roomName = this.createRoomName(user1ID, user2ID);
                        socket.join(roomName);
                        activeRooms.push(roomName);
                        console.log(`${socket.userId} joined room: ${roomName}`);
                    } else {
                    console.log(`Room already joined`);
                }
                });
                socket.on('leaveRoom', (data) => {
                    let user1ID :string = socket.userId!;
                    let user2ID = data.toID;
                    let roomName = this.createRoomName(user1ID, user2ID);
                    socket.leave(roomName);
                    console.log(`${socket.userId} left room: ${roomName}`);
                });
            socket.on('chatMessage', (data) => {
                //a Message is received by the server from onw of the sockets
            
                let user1ID: string = socket.userId!;
                let user2ID = data.toID;
                let roomIdx = this.checkIfRoomExists(user1ID, user2ID);

                if (roomIdx!= -1) {
                    let roomName = activeRooms[roomIdx];
                    this.doctorPatient.to(roomName).emit('chatMessage', data);
                    //check if the message is sent successfully or not
                    //save to the data Base 

                    console.log(`Message sent to room: ${roomName}`);
                }
            });
        });
    }



}












    // setUpChatSocket() {
    //     this.io.on('connection', (socket: Socket) => {
    //         console.log('A user connected');
    //         socket.on('login', (email) => {
    //             console.log(`User logged in: ${email}`);
    //             activeUsers[socket.id] = email;
    //         });
    //         socket.on('private message', ({ to, message }) => {
    //             const toSocketId = Object.keys(activeUsers).find(
    //                 (socketId) => activeUsers[socketId] === to
    //             );
    //             if (toSocketId) {
    //                 this.io.to(toSocketId).emit('private message', {
    //                     from: activeUsers[socket.id],
    //                     message: message,
    //                 });
    //             } else {
    //                 // Handle user not found (offline or invalid email)
    //                 console.log(`User not found: ${to}`);
    //             }
    //         });
    //     });
    // }

// // }
// export function  setUpChatSocket  (io: Server) {
    
//    io.on('connection', (socket) => {
//     console.log('A user connected');

 
//        socket.on('login', (email) => {
//            console.log(`User logged in: ${email}`);
//            activeUsers[socket.id] = email;
//        });

  
//        socket.on('private message', ({ to, message }) => {
//            const toSocketId = Object.keys(activeUsers).find(
//                (socketId) => activeUsers[socketId] === to
//            );

//            if (toSocketId) {
//                io.to(toSocketId).emit('private message', {
//                    from: activeUsers[socket.id],
//                    message: message,
//                });
//            } else {
//                // Handle user not found (offline or invalid email)
//                console.log(`User not found: ${to}`);
//            }
//        });
// });
// };