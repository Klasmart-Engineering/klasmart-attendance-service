import { Mutation, Resolver, Args } from "type-graphql";
import { Feedback, QuickFeedback } from "@src/entities/feedback";
import { UserInputError } from "apollo-server-express";
import { QuickFeedbackType, FeedbackType } from "@src/types";
import { SaveFeedbackArgs } from "@src/entities/argTypes";

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
        await feedback.save();
    } catch(e) {
        console.log(e);
    }
    console.log('feedback: ', feedback);
    return feedback;
  
  }
}