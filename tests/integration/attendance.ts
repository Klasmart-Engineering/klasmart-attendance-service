import { graphqlRequest } from "../utils/graphqlRequest";
import { 
  GET_CLASS_ATTENDANCE_QUERY, 
  GET_USER_ATTENDANCE_QUERY, 
  SAVE_ATTENDANCE_MUTATION, 
  SCHEDULE_ATTENDANCE_MUTATION,
  SEND_ATTENDANCE_MUTAION,
} from "../utils/graphql";
import { createRedisClient } from "../../src/utils/functions";
import { addRoomContext } from "../mockData/resolverMock";
import { attendanceMockDataWithDateString } from "../mockData/resolverMock";
import { getUniqueId, getTime } from "../mockData/functions";
import { ClassType } from "../../src/types";
export const attendance = () => {

  it("save attendance", async () => {
    // save attendance
    const mockData = attendanceMockDataWithDateString();
    const attendance = await graphqlRequest({
      source: SAVE_ATTENDANCE_MUTATION,
      variableValues: mockData
    });
    console.log('attendance: ', attendance);
    expect(attendance.data?.saveAttendance).toMatchObject(mockData);
  });

  it("get attendance by class", async () => {
    const roomId = getUniqueId();
    const mockData = attendanceMockDataWithDateString(false, roomId);
    await graphqlRequest({
      source: SAVE_ATTENDANCE_MUTATION,
      variableValues: mockData
    });
    const getClassAttendance = await graphqlRequest({
      source: GET_CLASS_ATTENDANCE_QUERY,
      variableValues: { roomId }
    });
    expect(getClassAttendance.data?.getClassAttendance[0]).toMatchObject(mockData);

  });

  it("get attendance by user", async () => {
    const mockData = attendanceMockDataWithDateString();
    await graphqlRequest({
      source: SAVE_ATTENDANCE_MUTATION,
      variableValues: mockData
    });
    const getUserAttendane = await graphqlRequest({
      source: GET_USER_ATTENDANCE_QUERY,
      variableValues: { userId: mockData.userId }
    });
    
    expect(getUserAttendane.data?.getUserAttendance[0]).toMatchObject(mockData);
  })

  it("schedule attendance", async () => {
    const redis = await createRedisClient();
    const roomId = getUniqueId();
    const context = {
      "classtype": ClassType.LIVE,
      "startat": getTime(-5),
      "endat": getTime(5)
    }
    await addRoomContext(redis, roomId, context);

    const response = await graphqlRequest({
      source: SCHEDULE_ATTENDANCE_MUTATION,
      variableValues: { roomId }
    });
    expect(response.data?.scheduleAttendance).toBeTruthy();
  })

  it("schedule attendance with Study class", async () => {
    // it should return false, so far attendances for Study
    // class is not scheduled

    const redis = await createRedisClient();
    const roomId = getUniqueId();
    const context = {
      "classtype": ClassType.STUDY,
      "startat": getTime(-5),
      "endat": getTime(5)
    }
    await addRoomContext(redis, roomId, context);

    const response = await graphqlRequest({
      source: SCHEDULE_ATTENDANCE_MUTATION,
      variableValues: { roomId }
    });
    expect(response.data?.scheduleAttendance).toBeFalsy();
  })

  it("send attendance", async () => {
    const roomId = getUniqueId();
    const teacherAttendanceData = attendanceMockDataWithDateString(true, roomId);
    const attendanceArr = []
    const teacherAttendance = await graphqlRequest({
      source: SAVE_ATTENDANCE_MUTATION,
      variableValues: teacherAttendanceData
    });
    attendanceArr.push(teacherAttendance);
    for ( var i = 0; i< 5; i++){
      const studentAttendanceData = attendanceMockDataWithDateString(false, roomId);
      const studentAttendance = await graphqlRequest({
        source: SAVE_ATTENDANCE_MUTATION,
        variableValues: studentAttendanceData
      });
      attendanceArr.push(studentAttendance);
    }

    await Promise.all(attendanceArr);
    const response = await graphqlRequest({
      source: SEND_ATTENDANCE_MUTAION,
      variableValues: {roomId}
    });
    expect(response.data?.sendAttendance).toBeTruthy();
  })
};
