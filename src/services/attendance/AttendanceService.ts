import Redis from "ioredis";
import { Cluster } from "ioredis";
import { getRepository, getConnection } from "typeorm";
import axios from "axios";
import {generateToken} from "../../jwt";
import {
    ClassType,
    RoomContext,
    AttendanceRequestType
} from "../../types";
import { Attendance } from "../../entities/attendance";
import { Pipeline } from "../../pipeline";
import {RedisKeys} from "../../redisKeys";
import { convertSessionRecordToSession } from "../../utils/functions";

export class AttendanceService {
    private client: Redis | Cluster;

    constructor(redis: Redis | Cluster) {
        this.client = redis;
        setInterval(() => {
            this.checkSchedules();
        }, 60*1000);
    }

    public async send(roomId: string): Promise<boolean> {
        const roomContext = await this.getRoomContext(roomId);
        
        if (roomContext.classType === ClassType.CLASS) {
            return this.sendClassAttendance(roomId);
        }else{
            return this.sendAttendance(roomId);
        }
    }

    public async sendAttendance(roomId: string): Promise<boolean> {
        const assessmentUrl = process.env.ASSESSMENT_ENDPOINT;
        if (!assessmentUrl) {
            return false;
        }
        
        for await (const session of this.getSessions(roomId)) {
            
            const attendance = new Attendance();
            try {
                attendance.sessionId = session.id;
                attendance.joinTimestamp = new Date(session.joinedAt);
                attendance.leaveTimestamp = new Date();
                attendance.roomId = roomId;
                attendance.userId = session.userId;
                attendance.isTeacher = session.isTeacher;
                await getConnection().createQueryBuilder()
                    .insert()
                    .into(Attendance)
                    .values(attendance)
                    .orIgnore()
                    .execute();
            } catch(e) {
                console.log(`Unable to save attendance: ${JSON.stringify(attendance)}`);
                console.log(e);
            
            }
        }
     
        try {
            const attendances = await getRepository(Attendance).find({ roomId });
            const attendanceIds = new Set([...attendances.map((a) => a.userId)]);

            let numberOfTeachers = 0;
            let numberOfStudents = 0;
            [...attendanceIds].map((a) => {
                for ( const attendance of attendances) {
                    if (a === attendance.userId) {
                        if (attendance.isTeacher) {
                            numberOfTeachers += 1;
                        } else {
                            numberOfStudents += 1;
                        }
                        break;
                    }
                }
            });
            // in live class to trigger attendance there should be at least
            // one teacher and one student
            const roomContext = await this.getRoomContext(roomId);
            if (roomContext.classType === ClassType.LIVE && (numberOfTeachers === 0 || numberOfStudents === 0)) {
                return false;
            }
            const body: AttendanceRequestType = {
                action: 'LeaveLiveRoom',
                attendance_ids: [...attendanceIds],
                class_end_time: roomContext.endAt,
                class_length: roomContext.endAt-roomContext.startAt,
                schedule_id: roomId,
            };
            const token = await generateToken(body);
            await axios.post(assessmentUrl, {
                token,
            });
            console.log("Attendance sent: ", roomId);
        } catch (e) {
            console.log("Unable to post attendance: ", roomId);
            console.error(e);
        }
        return true;
    }

    public async schedule(roomId: string): Promise<boolean> {
        const roomContext = await this.getRoomContext(roomId);
        if (roomContext.classType === ClassType.STUDY || roomContext.classType === undefined) return false;
        const tempStorageKeys = RedisKeys.tempStorageKeys();
        const tempStorageKey = RedisKeys.tempStorageKey(roomId);
        const tempStorageData = await this.client.get(tempStorageKey);
        if (!tempStorageData) {
            // send after n hour
            const time = new Date(roomContext.endAt*1000);
            if ( time > new Date()) {
                time.setSeconds(time.getSeconds() + Number(process.env.ASSESSMENT_GENERATE_TIME || 300));
                await this.client.set(tempStorageKey, time.getTime());
                await this.client.sadd(tempStorageKeys, roomId);
            }
        }
        return true;
    }

    private async sendClassAttendance(roomId: string): Promise<boolean> {
        const key = RedisKeys.classAttendees(roomId);
        const response = await this.client.get(key);
        console.log("classAttendees added: ",roomId, response);
        if (response) {
            const assessmentUrl = process.env.ASSESSMENT_ENDPOINT;
            if (!assessmentUrl) return false;
            const attendanceIds = response.split(",");
            console.log("classAttendees attendanceIds: ", attendanceIds);
            const roomContext = await this.getRoomContext(roomId);
            const requestBody: AttendanceRequestType = {
                action: 'LeaveLiveRoom',
                attendance_ids: [...attendanceIds],
                class_end_time: roomContext.endAt,
                class_length: roomContext.endAt-roomContext.startAt,
                schedule_id: roomId,
            };
            const token = await generateToken(requestBody);
            try{
                await axios.post(assessmentUrl, {
                    token,
                });
            }catch(e){
                console.log("cound not send class attendance");
            }
            console.log("classAttendees sent: ", roomId);
        }
        await this.client.del(key);
        return true;
    }

    private async getRoomContext(roomId: string): Promise<RoomContext> {
        const roomContextKey = RedisKeys.roomContext(roomId);
        const roomContext = await this.client.hgetall(roomContextKey);
        return {
            classType: roomContext.classtype,
            startAt: Number(roomContext.startat),
            endAt: Number(roomContext.endat),
        } as RoomContext;
    }

    private async checkSchedules() {
        const isTepmStorageLocked = RedisKeys.isTepmStorageLocked();
        const isLocked = await this.client.set(isTepmStorageLocked, "true", "NX");
        if (isLocked) {
            const tempStorageKeys = RedisKeys.tempStorageKeys();
            const pipeline = new Pipeline(this.client);
            let tempStorageSearchCursor = "0";
            do {
                const [newCursor, keys] = await this.client.sscan(tempStorageKeys, tempStorageSearchCursor);

                for (const roomId of keys) {
                    const tempSingleKey = RedisKeys.tempStorageKey(roomId);
                    const tempSingleData = await this.client.get(tempSingleKey);
                    const currentTime = new Date();
                    const diffInSeconds = Number(tempSingleData) - Math.floor(currentTime.getTime());
                    if (diffInSeconds <= 0) {
                        // trigger assessment then delete data from redis
                        await this.trigger(roomId);
                        await pipeline.del(tempSingleKey);
                        await pipeline.srem(tempStorageKeys, roomId);
                    }
                }
                tempStorageSearchCursor = newCursor;
            } while (tempStorageSearchCursor !== "0");

            await pipeline.exec();
        }

        await this.client.del(isTepmStorageLocked);
    }

    private async trigger(roomId: string) {
        await this.send(roomId);
    }

    private async* getSessions(roomId: string) {
        const roomSessionsKey = RedisKeys.roomSessions(roomId);
        let sessionSearchCursor = "0";
        do {
            const [newCursor, keys] = await this.client.sscan(roomSessionsKey, sessionSearchCursor);
            const pipeline = new Pipeline(this.client);
            for (const key of keys) {
                await pipeline.hgetall(key);
            }
            const sessions = await pipeline.exec();
            if(sessions){
                for (const [, session] of sessions) {
                    const sess = session as Record<string, string>;
                    yield convertSessionRecordToSession(sess);
                }
            }
            sessionSearchCursor = newCursor;
        } while (sessionSearchCursor !== "0");
    }
}

