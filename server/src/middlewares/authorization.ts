import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Model, Document } from 'mongoose';
import { HttpError, verifyToken } from '../utils';

const isAuthorized =
  (...authorizedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = req.decoded;
      if (authorizedRoles.includes(role)) return next();

      res.status(StatusCodes.FORBIDDEN).json({ message: 'Unauthorized' });
    } catch (e: any) {
      console.log(e.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  };

const isResourceOwner =
  (res: Response, next: NextFunction) => async (resourceModel: any, resourceID: string, userID: string) => {
    try {
      const resource = await resourceModel.findById(resourceID);
      if (!resource) return res.status(StatusCodes.NOT_FOUND).json('Resource not found');

      const ownerId = resource?.userID;

      if (ownerId === userID) return next();

      res.status(StatusCodes.FORBIDDEN).json('Unauthorized');
    } catch (e: any) {
      console.log(e.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  };

export { isAuthorized, isResourceOwner };
