import express, { Request, Response, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

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
  uploadRouter,
  cartRouter,
  orderRouter,
  medicineRouter,
  prescriptionRouter,
  reportRouter
} from './routes';
import { StatusCodes } from 'http-status-codes';

const app = express();

app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: true
  })
);

app.use(queryParser);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin as string);
  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(StatusCodes.OK).json({});
  }
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  next();
});

app.use('/auth', authRouter);
app.use('/me', meRouter);
app.use('/users', userRouter);
app.use('/doctors', doctorRouter);
app.use('/patients', patientRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);
app.use('/medicine', medicineRouter);
app.use('/requests', requestRouter);
app.use('/packages', packageRouter);
app.use('/chatrooms', chatroomRouter);
app.use('/payment', paymentRouter);
app.use('/upload', uploadRouter);
app.use('/prescription', prescriptionRouter);
app.use('/report', reportRouter);

app.all('*', (req: Request, res: Response) => res.status(404).send('Path Not Found'));

export default app;
