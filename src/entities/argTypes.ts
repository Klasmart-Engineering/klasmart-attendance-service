import { Field, Int, ArgsType } from "type-graphql";
import { QuickFeedbackInputType } from "./feedback";

@ArgsType()
export class SaveFeedbackArgs {
  @Field(() => String)
  roomId: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  sessionId: string;

  @Field(() => Int)
  stars: number;

  @Field(() => String)
  feedbackType: string;

  @Field(() => String)
  comment: string;

  @Field(() => [QuickFeedbackInputType])
  quickFeedback: QuickFeedbackInputType[]
}

@ArgsType()
export class SaveAttendanceArgs {
  @Field(() => String)
  sessionId: string;

  @Field(() => Date)
  joinTimestamp: Date;

  @Field(() => Date)
  leaveTimestamp: Date;

  @Field(() => Boolean)
  isTeacher: Boolean;

  @Field(() => String)
  userId: string;

  @Field(() => String, {nullable: true})
  roomId: string;
}