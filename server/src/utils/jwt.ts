import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET || '';

const generateToken = (userID: string, userRole: string): string =>
  jwt.sign({ id: userID, role: userRole }, TOKEN_SECRET);

const verifyToken = (token: string): string | jwt.JwtPayload => jwt.verify(token, TOKEN_SECRET);

export { generateToken, verifyToken };
