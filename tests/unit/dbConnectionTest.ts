import { createRedisClient } from '../../src/utils/functions';

export const dbConnectionTest = () => {
  it('test Redis connection', async () => {
    const redis = await createRedisClient();
    expect(redis.status).toEqual('ready');
    await redis.disconnect();
  })
}