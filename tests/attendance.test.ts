import { Connection } from "typeorm";
import { connectPostgres } from "./utils/postgresDB";
import { graphqlRequest } from "./utils/graphqlRequest";
import { SAVE_ATTENDANCE_MUTATION, GET_CLASS_ATTENDANCE_QUERY, GET_USER_ATTENDANCE_QUERY } from "./utils/graphql";
import { attendanceMockData } from "./mockData/resolverMock";

let connection: Connection;
// jest.useFakeTimers();
beforeAll(async () => {
    connection = await connectPostgres(true);
});

afterAll(async () => {
    await connection.close();
});

describe("queries", () => {
    it("test Attendance", async () => {

      // save attendance
      await graphqlRequest({
        source: SAVE_ATTENDANCE_MUTATION,
        variableValues: attendanceMockData
      });

      // get attendance by roomId
      const getClassAttendance = await graphqlRequest({
        source: GET_CLASS_ATTENDANCE_QUERY,
        variableValues: { roomId: attendanceMockData.roomId }
      });
      const singleClassAttendace = getClassAttendance.data?.getClassAttendance[0];
      expect(singleClassAttendace).toMatchObject({
            roomId: attendanceMockData.roomId,
            userId: attendanceMockData.userId,
            sessionId: attendanceMockData.sessionId,
            joinTimestamp: attendanceMockData.joinTimestamp,
            leaveTimestamp: attendanceMockData.leaveTimestamp
      });

      // get attendance bu userId
      const getUserAttendane = await graphqlRequest({
        source: GET_USER_ATTENDANCE_QUERY,
        variableValues: { userId: attendanceMockData.userId }
      });
      
      const singleUserAttendace = getUserAttendane.data?.getUserAttendance[0];
      expect(singleUserAttendace).toMatchObject({
            roomId: attendanceMockData.roomId,
            userId: attendanceMockData.userId,
            sessionId: attendanceMockData.sessionId,
            joinTimestamp: attendanceMockData.joinTimestamp,
            leaveTimestamp: attendanceMockData.leaveTimestamp
      });
    });
});
