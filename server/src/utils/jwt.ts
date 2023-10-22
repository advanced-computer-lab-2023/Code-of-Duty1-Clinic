import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET || '';

const generateToken = (userID: string, userRole: string): string =>
  jwt.sign({ id: userID, role: userRole }, TOKEN_SECRET, { expiresIn: '1h' });

const verifyToken = (token: string): string | jwt.JwtPayload | boolean => {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (e) {
    return false;
  }
};

export { generateToken, verifyToken };
