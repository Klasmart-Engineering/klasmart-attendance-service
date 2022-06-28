import request from "supertest";
import dotenv from "dotenv";
import { attendance } from "./attendance";
import { feedback } from "./feedback";
import { globalSetup, globalTeardown} from "../config";

dotenv.config();
jest.setTimeout(40*1000);

const agent = request.agent(`http://localhost:${process.env.PORT}`);
beforeAll(async () => {
    await globalSetup();
});

afterAll(async () => {
    await globalTeardown();
});


describe("queries", () => {
    attendance(agent);
    feedback(agent);
});
