import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';
import { STATUS_CODES } from 'http';

const controller = (res: Response) => {
  return (service: Function) => {
    return async (...args: any[]) => {
      try {
        const result = await service(...args);
        if (result.JWTToken) {
          res.cookie('token', result.JWTToken, { httpOnly: true });
          delete result.JWTToken; // in order not to send the token in the res as json
        }

        res.status(result.status || StatusCodes.OK).json(result);
      } catch (error: any) {
        console.log(error);
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
