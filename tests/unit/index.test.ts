import { attendanceServiceTest } from "./attendanceServiceTest";
import { attendanceResolverTest } from "./attendanceResolverTest";
import { Connection } from "typeorm";
import { connectPostgres } from "../utils/postgresDB";
import dotenv from "dotenv";
dotenv.config();

let connection: Connection;
// jest.useFakeTimers();
beforeAll(async () => {
    connection = await connectPostgres(true);
});

afterAll(async () => {
    await connection.close();
});

describe("queries", () => {
    attendanceResolverTest();
    attendanceServiceTest();
});
