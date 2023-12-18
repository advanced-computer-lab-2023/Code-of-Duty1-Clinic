import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const controller =
  (res: Response) =>
  (service: Function) =>
  async (...args: any[]) => {
    try {
      const result = await service(...args);

      if (result.token) {
        res.cookie('token', result.token, {
          httpOnly: false,
          sameSite: false,
          secure: false,
          maxAge: 1000 * 60 * 60 * 24
        });
      }

      res.status(result.status || StatusCodes.OK).json(result);
    } catch (error: any) {
      console.log(error.message);

      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  };

export default controller;
