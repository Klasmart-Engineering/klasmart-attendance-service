import Redis from "ioredis";
import { Cluster }  from "ioredis";
import { Session } from "../types";

export function convertSessionRecordToSession(session: Record<string, string>): Session {
    return {
        id: session.id,
        userId: session.userId,
        name: session.name,
        streamId: session.streamId,
        email: session.email,
        isTeacher: session.isTeacher === "true",
        isHost: session.isHost === "true",
        joinedAt: Number(session.joinedAt),
    } as Session;
}

export  async function createRedisClient() {
    const redisMode = process.env.REDIS_MODE ?? "NODE";
    const port = Number(process.env.REDIS_PORT) || 6379;
    const host = process.env.REDIS_HOST || "localhost";
    const password = process.env.REDIS_PASS;
    const lazyConnect = true;

    let redis: Redis | Cluster;
    if (redisMode === "CLUSTER") {
        redis = new Cluster([
            {
                port,
                host,
            },
        ], {
            lazyConnect,
            redisOptions: {
                password,
            },
        });
    } else {
        redis = new Redis(port, host, {
            lazyConnect: true,
            password,
        });
    }
    await redis.connect();
    console.log("🔴 Redis database connected");
    return redis;
}