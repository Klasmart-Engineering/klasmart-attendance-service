import { Mutation, Resolver, Args } from "type-graphql";
import { Feedback, QuickFeedback } from "../entities/feedback";
import { UserInputError } from "apollo-server-express";
import { QuickFeedbackType, FeedbackType } from "../types";
import { SaveFeedbackArgs } from "../entities/argTypes";
import { getConnection } from "typeorm";

@Resolver(Feedback)
export class FeedbackResolver{

  @Mutation(() => Feedback)
    async saveFeedback(
    @Args() { 
        roomId, userId, sessionId, stars, 
        feedbackType, comment, quickFeedback 
    }: SaveFeedbackArgs

    ): Promise<Feedback>{

        const feedbackArray = [];
        for (const { type, stars } of quickFeedback) {
            const item = new QuickFeedback();
            const quickFeedbackType = Object.values(QuickFeedbackType).find((val: string) => val.toLowerCase() === type.toLowerCase());
            if (!quickFeedbackType) {
                throw new UserInputError(`invalid quick feedback type: ${type}`);
            }
            item.type = quickFeedbackType;
            item.stars = stars;
            feedbackArray.push(item);
        }

        const feedback = new Feedback();
        try {
            feedback.sessionId = sessionId;
            feedback.roomId = roomId;
            feedback.userId = userId;
            feedback.type = feedbackType === "END_CLASS" ? FeedbackType.EndClass : FeedbackType.LeaveClass;
            feedback.stars = stars;
            feedback.comment = comment;
            feedback.quickFeedback = feedbackArray;
            await getConnection().createQueryBuilder()
                .insert()
                .into(Feedback)
                .values(feedback)
                .orIgnore()
                .execute();
        } catch(e) {
            console.log("Unable to save feedback: ", e);
        }
        console.log("logFeedback", feedback);
        return feedback;
  
    }
}