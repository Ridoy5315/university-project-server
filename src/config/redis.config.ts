import { createClient } from 'redis';
import config from '.';

export const redisClient = createClient({
    username: config.redis.redis_username,
    password: config.redis.redis_password,
    socket: {
        host: config.redis.redis_host,
        port: Number(config.redis.redis_port)
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));


export const connectRedis = async() => {
     if(!redisClient.isOpen){
          await redisClient.connect();
          console.log("Redis Connected")
     }
}