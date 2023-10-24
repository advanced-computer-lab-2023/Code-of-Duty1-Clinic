import express, { Request, Response } from 'express';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import multer from 'multer';
import { queryParser } from './middlewares';
import {
  authRouter,
  meRouter,
  userRouter,
  doctorRouter,
  patientRouter,
  requestRouter,
  packageRouter,
  chatroomRouter,
  paymentRouter,
  uploadRouter
} from './routes';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(helmet());

app.use(queryParser);

app.use('/auth', authRouter);
app.use('/me', meRouter);
app.use('/users', userRouter);
app.use('/doctors', doctorRouter);
app.use('/patients', patientRouter);
app.use('/requests', requestRouter);
app.use('/packages', packageRouter);
app.use('/chatrooms', chatroomRouter);
app.use('/payment', paymentRouter);
app.use('/upload', uploadRouter);

app.all('*', (req: Request, res: Response) => res.status(404).send('Path Not Found'));

export default app;
