import { createClient } from "redis";

const redisPublisher = createClient();
const redisSubscriber = createClient();

const connectRedis = async () => {
  try {
    await redisPublisher.connect();
    await redisSubscriber.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Redis connection error:", error);
    process.exit(1);
  }
};

export { redisPublisher, redisSubscriber, connectRedis };