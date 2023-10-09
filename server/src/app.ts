import express, { Request, Response } from 'express';
// import session from 'express-session';
import { json, urlencoded } from 'body-parser';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { queryParser } from './middlewares';

import authRouter from './routes/auth.route';
import appointmentRouter from './routes/appointment.route';
import chatroomRouter from './routes/chatroom.route';
import contractRouter from './routes/contract.route';
import notificationRouter from './routes/notification.route';
import packageRouter from './routes/package.route';
import prescriptionRouter from './routes/prescription.route';
import userRouter from './routes/user.route';

const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(helmet());
app.use(compression());
// app.use(
//   session({
//     secret: 'superSecret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       sameSite: true,
//       secure: false
//     }
//   })
// );
app.use(queryParser);

app.use('/auth', authRouter);
app.use('/appointments', appointmentRouter);
app.use('/chatrooms', chatroomRouter);
app.use('/contracts', contractRouter);
app.use('/notifications', notificationRouter);
app.use('/packages', packageRouter);
app.use('/prescriptions', prescriptionRouter);
app.use('/users', userRouter);

app.all('*', (req: Request, res: Response) => res.status(404).send('NOT FOUND'));

export default app;
