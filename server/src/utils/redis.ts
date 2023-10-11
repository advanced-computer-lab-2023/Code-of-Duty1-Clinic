import Redis from 'ioredis';
import { StatusCodes } from 'http-status-codes';
import HttpError from './HttpError';
import dotenv from 'dotenv';

dotenv.config();
const REDIS_PASSWORD = process.env.REDIS_SECRET_PASS;

const redisClient = new Redis({
  password: REDIS_PASSWORD,
  host: 'redis-15759.c135.eu-central-1-1.ec2.cloud.redislabs.com',
  port: 15759
});

redisClient.on('error', (error) => {
  console.log(`Redis error: ${error.message}`);
  throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Redis Error');
});

const putRedis = async (key: any, data: any): Promise<string> =>
  redisClient.set(JSON.stringify(key), JSON.stringify(data), 'EX', 3600);

const getRedis = async (key: any): Promise<string | null> => redisClient.get(JSON.stringify(key));

const delRedis = async (key: any): Promise<number> => redisClient.del(JSON.stringify(key));

const clearRedis = async () => redisClient.flushall();

/*
const keyGenerator = (reqKey: object): object => {
  const sortedKeys = Object.keys(reqKey).sort();
  const sortedKey: object = {};
  for (const key of sortedKeys) sortedKey[key] = reqKey[key];

  return sortedKey;
};
*/

export { putRedis, getRedis, delRedis, clearRedis};
