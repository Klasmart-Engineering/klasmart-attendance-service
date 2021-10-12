import "module-alias/register";
import { Connection } from "typeorm";
import * as dotenv from "dotenv"
import { connectPostgres } from "./utils/postgresDB";
import { graphqlRequest } from "./utils/graphqlRequest";
import { SAVE_ATTENDANCE_MUTATION, GET_CLASS_ATTENDANCE_QUERY } from "./utils/graphql";
import { attendanceMockData } from "./mockData/resolverMock";
dotenv.config();
let connection: Connection;
// jest.useFakeTimers();
beforeAll(async () => {
    connection = await connectPostgres();
});

afterAll(async () => {
    await connection.close();
});

describe("queries", () => {
    it("save Attendance", async () => {
      const savedAttendance = await graphqlRequest({
        source: SAVE_ATTENDANCE_MUTATION,
        variableValues: attendanceMockData
      });

      console.log(savedAttendance.data?.savedAttendance);

      const getClassAttendance = await graphqlRequest({
        source: GET_CLASS_ATTENDANCE_QUERY,
        variableValues: { roomId: attendanceMockData.roomId }
      });


      console.log(getClassAttendance.data);
    });



});
