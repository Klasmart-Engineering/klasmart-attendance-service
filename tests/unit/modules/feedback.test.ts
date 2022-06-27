
import { FeedbackResolver } from "../../../src/modules/feedback";
import { feedbackMockData } from "../../mockData/resolverMock";
import { SaveFeedbackArgs } from "../../../src/entities/argTypes";
import { connection } from "../../../src/index";

describe("modules", () => {

    describe("feedback", () => {
        const fedbackResolver = new FeedbackResolver();
        describe("saveFeedback", () => {

            it("should resolve falsy when there is an error saving feedback into DB", async () => {
                const mockData = feedbackMockData as any as SaveFeedbackArgs;
                const res = await fedbackResolver.saveFeedback(mockData);
                expect(res).toBeFalsy();
            });
            it("should resolve truth when there is no error", async () => {
                const mockData = feedbackMockData as any as SaveFeedbackArgs;
                const mockedFuncitons: any = {
                    insert: () => mockedFuncitons,
                    into: () => mockedFuncitons,
                    values: () => mockedFuncitons,
                    orIgnore: () => mockedFuncitons,
                    execute: () => mockData
                };
                const spy = jest.spyOn(connection, "createQueryBuilder");
                spy.mockImplementationOnce(() => mockedFuncitons);
                const res = await fedbackResolver.saveFeedback(mockData);
                expect(res?.sessionId).toMatch(mockData.sessionId);
                expect(res?.roomId).toMatch(mockData.roomId);
                expect(res?.stars).toEqual(mockData.stars);
            });
        });
    });
});