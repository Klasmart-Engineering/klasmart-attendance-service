import { Connection } from "typeorm";
import { connectPostgres } from "./utils/postgresDB";
import { graphqlRequest } from "./utils/graphqlRequest";
import { SAVE_FEEDBACK_MUTATION } from "./utils/graphql";
import { feedbackMockData } from "./mockData/resolverMock";

let connection: Connection;
// jest.useFakeTimers();
beforeAll(async () => {
    connection = await connectPostgres(true);
});

afterAll(async () => {
    await connection.close();
});

describe("queries", () => {
    it("test Save Feedback", async () => {
      // save feedback
      await graphqlRequest({
        source: SAVE_FEEDBACK_MUTATION,
        variableValues: feedbackMockData
      });
    });
});
