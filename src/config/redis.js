import redis from 'redis';

const client = (function () {
  if (process.env.NODE_ENV === 'production') {
    return redis.createClient(process.env.REDIS_URL);
  }
  return redis.createClient();
}());

export default client;
