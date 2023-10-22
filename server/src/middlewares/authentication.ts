import { Request, Response, NextFunction } from 'express';
import { getRedis, verifyToken } from '../utils';
import { StatusCodes } from 'http-status-codes';

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization || req.cookies.token || req.query.token;

    // Verify the JWT token
    // const tokenExist = token ?? await getRedis(token);
    const decoded = token ?? verifyToken(token);

    if (decoded) {
      (req as any).user = decoded; // Store the decoded user information in the request
      next();
    }

    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export { isAuthenticated };
