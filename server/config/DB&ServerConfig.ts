import dotenv from 'dotenv';
dotenv.config();
let BACKEND_SERVER_PORT: Number = 3000;
const MONGO_URI: String = process.env.MONGO_URI || '';

if (process.env.PORT) BACKEND_SERVER_PORT = Number(process.env.PORT);

export const config = {
  server: { port: BACKEND_SERVER_PORT },
  DB: { url: MONGO_URI }
};
