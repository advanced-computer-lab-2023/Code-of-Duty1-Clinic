import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
// import '@types/jest';

jest.mock('ioredis', () => require('ioredis-mock'));

import { clearRedis } from '../utils';
import app from '../server';

const myRequest = supertest(app);

let mongoServer: MongoMemoryServer;

// const connectDB = async (): Promise<void> => {
//   mongoServer = await MongoMemoryServer.create();
//   const mongoUri = mongoServer.getUri();

//   await mongoose.connect(mongoUri);
// };
const connectDB = async (): Promise<MongoMemoryServer> => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);

  return mongoServer; // Return the instance
};
beforeAll(async () => {
  console.log('Before ALL');
  await connectDB();
}, 5000 * 2);

afterAll(async () => {
  // await clearRedis();

  await mongoose.disconnect();
  await mongoServer.stop();
});
