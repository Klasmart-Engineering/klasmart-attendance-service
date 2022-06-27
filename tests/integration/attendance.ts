import  {SuperAgentTest}  from "supertest"; 
import { 
    GET_CLASS_ATTENDANCE_QUERY, 
    GET_USER_ATTENDANCE_QUERY, 
    SAVE_ATTENDANCE_MUTATION, 
    SCHEDULE_ATTENDANCE_MUTATION,
    SEND_ATTENDANCE_MUTAION,
} from "../utils/graphql";
import { createRedisClient } from "../../src/utils/functions";
import { attendanceMockDataWithDateString, addRoomContext } from "../mockData/resolverMock";
import { getUniqueId, getTime } from "../mockData/functions";
import { ClassType } from "../../src/types";
export const attendance = (agent: SuperAgentTest) => {

    it("save attendance", async () => {
    // save attendance
        const mockData = attendanceMockDataWithDateString();
        const response = await agent.post("/attendance").send(
            {
                query: SAVE_ATTENDANCE_MUTATION,
                variables: mockData
            });
        const data = response.body.data.saveAttendance;
        expect(data.roomId).toMatch(mockData.roomId);
        expect(data.userId).toMatch(mockData.userId);
        expect(data.sessionId).toMatch(mockData.sessionId);
        expect(data.isTeacher).toBe(mockData.isTeacher);
    });

    it("get attendance by class", async () => {
        const roomId = getUniqueId();
        const mockData = attendanceMockDataWithDateString(false, roomId);

        await agent.post("/attendance").send(
            {
                query: SAVE_ATTENDANCE_MUTATION,
                variables: mockData
            });
        
        const response = await agent.post("/attendance").send(
            {
                query: GET_CLASS_ATTENDANCE_QUERY,
                variables: mockData
            });
        const data = response.body.data.getClassAttendance[0];
        expect(data.roomId).toMatch(mockData.roomId);
        expect(data.userId).toMatch(mockData.userId);
        expect(data.sessionId).toMatch(mockData.sessionId);
        expect(data.isTeacher).toBe(mockData.isTeacher);

    });

    it("get attendance by user", async () => {
        const mockData = attendanceMockDataWithDateString();
        await agent.post("/attendance").send(
            {
                query: SAVE_ATTENDANCE_MUTATION,
                variables: mockData
            });

        const response = await agent.post("/attendance").send(
            {
                query: GET_USER_ATTENDANCE_QUERY,
                variables: { userId: mockData.userId }
            });
        
        const data = response.body.data.getUserAttendance[0];
        expect(data.roomId).toMatch(mockData.roomId);
        expect(data.userId).toMatch(mockData.userId);
        expect(data.sessionId).toMatch(mockData.sessionId);
        expect(data.isTeacher).toBe(mockData.isTeacher);
    });

    it("schedule attendance", async () => {
        const redis = await createRedisClient();
        const roomId = getUniqueId();
        const context = {
            "classtype": ClassType.LIVE,
            "startat": getTime(-5),
            "endat": getTime(5)
        };
        await addRoomContext(redis, roomId, context);
        const response = await agent.post("/attendance").send(
            {
                query: SCHEDULE_ATTENDANCE_MUTATION,
                variables: { roomId}
            });
        expect(response.body.data.scheduleAttendance).toBeTruthy();
    });

    it("schedule attendance with Study class", async () => {
    // it should return false, so far attendances for Study
    // class is not scheduled

        const redis = await createRedisClient();
        const roomId = getUniqueId();
        const context = {
            "classtype": ClassType.STUDY,
            "startat": getTime(-5),
            "endat": getTime(5)
        };
        await addRoomContext(redis, roomId, context);
        const response = await agent.post("/attendance").send(
            {
                query: SCHEDULE_ATTENDANCE_MUTATION,
                variables: { roomId}
            });
        expect(response.body.data.scheduleAttendance).toBeFalsy();
    });

    it("send attendance", async () => {
        const roomId = getUniqueId();
        const teacherAttendanceData = attendanceMockDataWithDateString(true, roomId);
        const attendanceArr:any[] = [];
        const teacherAttendance = await agent.post("/attendance").send(
            {
                query: SAVE_ATTENDANCE_MUTATION,
                variables: teacherAttendanceData
            });
        attendanceArr.push(teacherAttendance);
        for ( let i = 0; i< 5; i++){
            const studentAttendanceData = attendanceMockDataWithDateString(false, roomId);
            const studentAttendance = await agent.post("/attendance").send(
                {
                    query: SAVE_ATTENDANCE_MUTATION,
                    variables: studentAttendanceData
                });
            attendanceArr.push(studentAttendance);
        }

        await Promise.all(attendanceArr);
        const response = await agent.post("/attendance").send(
            {
                query: SEND_ATTENDANCE_MUTAION,
                variables: {roomId}
            });
        expect(response.body.data?.sendAttendance).toBeTruthy();
    });
};
