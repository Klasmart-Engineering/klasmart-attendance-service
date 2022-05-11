import { createRedisClient } from '../../src/utils/functions';
import { AttendanceService } from '../../src/services/attendance/AttendanceService';
import { getUniqueId, getTime } from '../mockData/functions';
import { addRoomContext, addClassAttendees } from "../mockData/resolverMock";
import { ClassType } from '../../src/types';
import { AttendancesResolver } from "../../src/modules/attendance";
import { attendanceMockData } from "../mockData/resolverMock";
import { SaveAttendanceArgs } from "../../src/entities/argTypes";
export const attendanceServiceTest = async () => {
  
  it("test AttendanceService.schedule with non existing roomId", async () => {
    const redis = await createRedisClient();
    const attendanceService = new AttendanceService(redis);
    const roomId = getUniqueId();
    const res = await attendanceService.schedule(roomId);
    expect(res).toBeFalsy();
    redis.disconnect() ;
  })

  it("test AttendanceService.schedule with existing roomId", async () => {
    const redis = await createRedisClient();
    const attendanceService = new AttendanceService(redis);
    const roomId = getUniqueId();
    const context = {
      "classtype": ClassType.LIVE,
      "startat": getTime(-5),
      "endat": getTime(5)
    }
    await addRoomContext(redis, roomId, context);
    const res = await attendanceService.schedule(roomId);
    expect(res).toBeTruthy();
    redis.disconnect();
  })

  it("test AttendanceService.schedule in Study class", async () => {
    // do not schedule attendance in Study calss
    const redis = await createRedisClient();
    const attendanceService = new AttendanceService(redis);
    const roomId = getUniqueId();
    const context = {
      "classtype": ClassType.STUDY,
      "startat": getTime(-5),
      "endat": getTime(5)
    }
    await addRoomContext(redis, roomId, context);
    const res = await attendanceService.schedule(roomId);
    expect(res).toBeFalsy();
    redis.disconnect();
  })

  it("test AttendanceService.sendAttendance in Live class with one teacher", async () => {
    // do not schedule attendance in Study calss
    const redis = await createRedisClient();
    const attendanceService = new AttendanceService(redis);
    const roomId = getUniqueId();
    const context = {
      "classtype": ClassType.LIVE,
      "startat": getTime(-5),
      "endat": getTime(5)
    }
    await addRoomContext(redis, roomId, context);
    
    // create teacher data and save in Postgres
    const attendancesResolver = new AttendancesResolver();
    const teacherData = attendanceMockData(true, roomId) as SaveAttendanceArgs;
    await attendancesResolver.saveAttendance(teacherData);
    const res = await attendanceService.sendAttendance(roomId);
    expect(res).toBeFalsy()
    redis.disconnect();
  })

  it("test AttendanceService.sendAttendance in Live class with two teacher", async () => {
    // do not schedule attendance in Study calss
    const redis = await createRedisClient();
    const attendanceService = new AttendanceService(redis);
    const roomId = getUniqueId();
    const context = {
      "classtype": ClassType.LIVE,
      "startat": getTime(-5),
      "endat": getTime(5)
    }
    await addRoomContext(redis, roomId, context);
    
    const attendancesResolver = new AttendancesResolver();
    // create first teacher data and save in Postgres db
    const firstTeacherData = attendanceMockData(true, roomId) as SaveAttendanceArgs;
    await attendancesResolver.saveAttendance(firstTeacherData);

    // create second teacher data and save in Postgres db
    const secondTeacherData = attendanceMockData(true, roomId) as SaveAttendanceArgs;
    await attendancesResolver.saveAttendance(secondTeacherData);
    const res = await attendanceService.sendAttendance(roomId);
    expect(res).toBeFalsy()
    redis.disconnect();
  })

  it("test AttendanceService.sendAttendance in Live class with one student", async () => {
    // do not schedule attendance in Study calss
    const redis = await createRedisClient();
    const attendanceService = new AttendanceService(redis);
    const roomId = getUniqueId();
    const context = {
      "classtype": ClassType.LIVE,
      "startat": getTime(-5),
      "endat": getTime(5)
    }
    addRoomContext(redis, roomId, context);
    
    // create student data and save in Postgres db
    const attendancesResolver = new AttendancesResolver();
    const studentData = attendanceMockData(false, roomId) as SaveAttendanceArgs;
    await attendancesResolver.saveAttendance(studentData);
    const res = await attendanceService.sendAttendance(roomId);
    expect(res).toBeFalsy()
    redis.disconnect();
  })

  it("test AttendanceService.sendAttendance in Live class with two student", async () => {
    // do not schedule attendance in Study calss
    const redis = await createRedisClient();
    const attendanceService = new AttendanceService(redis);
    const roomId = getUniqueId();
    const context = {
      "classtype": ClassType.LIVE,
      "startat": getTime(-5),
      "endat": getTime(5)
    }
    await addRoomContext(redis, roomId, context);
    
    const attendancesResolver = new AttendancesResolver();
    // create first student data and save in Postgres db
    const firstStudentData = attendanceMockData(false, roomId) as SaveAttendanceArgs;
    await attendancesResolver.saveAttendance(firstStudentData);

    // create second student data and save in Postgres db
    const secondStudentData = attendanceMockData(false, roomId) as SaveAttendanceArgs;
    await attendancesResolver.saveAttendance(secondStudentData);

    const res = await attendanceService.sendAttendance(roomId);
    expect(res).toBeFalsy()
    redis.disconnect();
  })

  it("test AttendanceService.sendAttendance in Live class with one teacher and on student", async () => {
    // do not schedule attendance in Study calss
    const redis = await createRedisClient();
    const attendanceService = new AttendanceService(redis);
    const roomId = getUniqueId();
    const context = {
      "classtype": ClassType.LIVE,
      "startat": getTime(-5),
      "endat": getTime(5)
    }
    await addRoomContext(redis, roomId, context);
    
    const attendancesResolver = new AttendancesResolver();
    // create teacher data and save in Postgres db
    const teacherData = attendanceMockData(true, roomId) as SaveAttendanceArgs;
    await attendancesResolver.saveAttendance(teacherData);

    // create student data and save in Postgres db
    const studentData = attendanceMockData(false, roomId) as SaveAttendanceArgs;
    await attendancesResolver.saveAttendance(studentData);

    const res = await attendanceService.sendAttendance(roomId);
    expect(res).toBeTruthy()
    redis.disconnect();
  })

  it("test AttendanceService.send in Class type class", async () => {
    // do not schedule attendance in Study calss
    const redis = await createRedisClient();
    const attendanceService = new AttendanceService(redis);
    const roomId = getUniqueId();
    const context = {
      "classtype": ClassType.CLASS,
      "startat": getTime(-5),
      "endat": getTime(5)
    }
    await addRoomContext(redis, roomId, context);
    await addClassAttendees(redis, roomId, 5);
    const res = await attendanceService.send(roomId)
    expect(res).toBeTruthy()
    redis.disconnect();
  })
}