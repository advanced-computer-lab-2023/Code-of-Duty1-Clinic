import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const controller =
  (res: Response) =>
  (service: Function) =>
  async (...args: any[]) => {
    try {
      const result = await service(...args);
      console.log(result +"------"
  )
      if (result.token) {
        const token = result.token;
        console.log(token);
        return res
          .cookie('token', token, {
            httpOnly: false,
            sameSite: false,
            secure: false,
            maxAge: 1000 * 1000
          })
          .status(result.status || StatusCodes.OK)
          .json(result);
        delete result.token;
      }

      res.status(result.status || StatusCodes.OK).json(result);
    } catch (error: any) {
      console.log(error);

      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  };

export default controller;
