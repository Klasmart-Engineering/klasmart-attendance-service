import { getRandomFeedbackType, getRandomQuickFeedbackType, getRandomNumber, getUniqueId } from "./functions";

export const attendanceMockData = {
  roomId: getUniqueId(),
  userId: getUniqueId(),
  sessionId: getUniqueId(),
  joinTimestamp: "2021-10-08T20:48:40.446Z",
  leaveTimestamp: "2021-10-08T20:48:40.446Z",
};

export const feedbackMockData = {
  roomId: getUniqueId(),
  userId: getUniqueId(),
  sessionId: getUniqueId(),
  stars: getRandomNumber(5)+1,
  comment: "was awesome",
  feedbackType: getRandomFeedbackType(),
  quickFeedback: { type: getRandomQuickFeedbackType(), stars: getRandomNumber(5)+1 }
}