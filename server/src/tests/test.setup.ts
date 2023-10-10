import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
import '@types/jest';

jest.mock('ioredis', () => require('ioredis-mock'));

import app from '../server';
const myRequest = supertest(app);

let mongoServer: MongoMemoryServer;

const connectDB = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
};

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  // await clearRedis();

  await mongoose.disconnect();
  await mongoServer.stop();
});
