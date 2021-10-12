import "module-alias/register";
import { Connection } from "typeorm";
import * as dotenv from "dotenv"
import { connectPostgres } from "./utils/postgresDB";
import { graphqlRequest } from "./utils/graphqlRequest";
import { SAVE_ATTENDANCE_MUTATION } from "./utils/graphql";
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
    it("token", async () => {
      const savedAttendance = await graphqlRequest({
        source: SAVE_ATTENDANCE_MUTATION,
        variableValues: {
            roomId: "1",
            userId: "123",
            sessionId: "12345",
            joinTimestamp: "2021-10-08T20:48:40.446Z",
            leaveTimestamp: "2021-10-08T20:48:40.446Z",
          
        }
      });

      console.log(savedAttendance);
    });
});
