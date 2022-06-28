import  {SuperAgentTest}  from "supertest";
import { SAVE_FEEDBACK_MUTATION } from "../utils/graphql";
import { feedbackMockData } from "../mockData/resolverMock";


export const feedback = (agent: SuperAgentTest) => {
    it("test Save Feedback", async () => {
        // save feedback
        const response = await agent.post("/attendance").send(
            {
                query: SAVE_FEEDBACK_MUTATION,
                variables: feedbackMockData
            });
        const savedFeedback = response.body.data?.saveFeedback;
        expect(savedFeedback.roomId).toMatch(feedbackMockData.roomId);
        expect(savedFeedback.userId).toMatch(feedbackMockData.userId);
        expect(savedFeedback.sessionId).toMatch(feedbackMockData.sessionId);
        expect(savedFeedback.stars).toEqual(feedbackMockData.stars);
    });
};
