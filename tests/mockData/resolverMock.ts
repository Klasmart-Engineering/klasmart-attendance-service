import { getRandomFeedbackType, getRandomQuickFeedbackType, getRandomNumber, getUniqueId, getTime } from "./functions";
import { RedisKeys } from "../../src/redisKeys";
import Redis from "ioredis";

export const attendanceMockData = (isTeacher = false, roomId: string=getUniqueId()) => {
    return {
        roomId,
        userId: getUniqueId(),
        sessionId: getUniqueId(),
        isTeacher,
        joinTimestamp: new Date(getTime(-5)*1000),
        leaveTimestamp: new Date(getTime()*1000),
    };
};

export const attendanceMockDataWithDateString = (isTeacher = false, roomId: string=getUniqueId()) => {
    return {
        roomId,
        userId: getUniqueId(),
        sessionId: getUniqueId(),
        isTeacher,
        joinTimestamp: "2022-10-08T20:48:40.446Z",
        leaveTimestamp: "2022-10-08T20:48:40.446Z",
    };
};

export const feedbackMockData = {
    roomId: getUniqueId(),
    userId: getUniqueId(),
    sessionId: getUniqueId(),
    stars: getRandomNumber(5)+1,
    comment: "was awesome",
    feedbackType: getRandomFeedbackType(),
    quickFeedback: [{ type: getRandomQuickFeedbackType(), stars: getRandomNumber(5)+1 }]
};

export const addRoomContext = async (client: Redis.Redis | Redis.Cluster,roomId: string, context: any) => {
    const roomContextKey = RedisKeys.roomContext(roomId);
    await client.hset(roomContextKey, "classtype", context?.classtype || "");
    await client.hset(roomContextKey, "startat", context?.startat || "");
    await client.hset(roomContextKey, "endat", context?.endat || "");
};

export const addClassAttendees = async (client: Redis.Redis | Redis.Cluster,roomId: string, numOfStudents = 1) => {
    const userIds: string[] = [];
    for (let i = 0; i< numOfStudents; i++){
        userIds.push(getUniqueId());
    }
    const key = RedisKeys.classAttendees(roomId);
    await client.set(key, userIds.toString());
};