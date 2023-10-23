import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'someRandValue';

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
