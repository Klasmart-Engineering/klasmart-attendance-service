import { graphqlRequest } from "../utils/graphqlRequest";
import { SAVE_FEEDBACK_MUTATION } from "../utils/graphql";
import { feedbackMockData } from "../mockData/resolverMock";


export const feedback = () => {
    it("test Save Feedback", async () => {
      // save feedback
      await graphqlRequest({
        source: SAVE_FEEDBACK_MUTATION,
        variableValues: feedbackMockData
      });
    });
};
