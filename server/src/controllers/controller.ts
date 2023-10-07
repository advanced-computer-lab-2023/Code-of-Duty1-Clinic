import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';

const controller = (res: Response, session?: any) => {
  return (service: Function) => {
    return async (...args: any[]) => {
      try {
        const result = await service(...args);
        if (session && result.token) session.token = result.token;

        res.status(result.status).json(result);
      } catch (error: any) {
        // console.log(error);

        if (error instanceof HttpError) {
          res.status(error.statusCode).send(error.message);
        } else {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
        }
      }
    };
  };
};

export default controller;
