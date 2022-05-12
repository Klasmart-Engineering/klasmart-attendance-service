import { Connection } from "typeorm";
import { connectPostgres } from "../utils/postgresDB";
import { attendance } from "./attendance";
import { feedback } from "./feedback";
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
    attendance();
    feedback();
});
