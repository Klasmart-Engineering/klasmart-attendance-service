export const SAVE_ATTENDANCE_MUTATION = `
  mutation saveAttendance($userId: String!, $leaveTimestamp: DateTime!, $joinTimestamp: DateTime!, $sessionId: String!, $roomId: String!) {
      saveAttendance(userId: $userId, leaveTimestamp: $leaveTimestamp, joinTimestamp: $joinTimestamp, sessionId: $sessionId, roomId: $roomId) {
        roomId,
        userId,
        sessionId,
        joinTimestamp,
        leaveTimestamp,
      }
  }
`;

export const GET_CLASS_ATTENDANCE_QUERY = `
  query Query($roomId: String!) {
    getClassAttendance(roomId: $roomId) {
      roomId
      userId
      sessionId
      joinTimestamp
      leaveTimestamp
    }
  }
`;

export const GET_USER_ATTENDANCE_QUERY = `
  query Query($userId: String!) {
    getUserAttendance(userId: $userId) {
      roomId
      userId
      sessionId
      joinTimestamp
      leaveTimestamp
    }
  }
`;

export const SAVE_FEEDBACK_MUTATION = `
  mutation SaveFeedbackMutation($roomId: String!, $userId: String!, $sessionId: String!, $stars: Int!, $feedbackType: String!, $comment: String!, $quickFeedback: [QuickFeedbackInputType!]!) {
    saveFeedback(roomId: $roomId, userId: $userId, sessionId: $sessionId, stars: $stars, feedbackType: $feedbackType, comment: $comment, quickFeedback: $quickFeedback) {
      roomId
      userId
      sessionId
      stars
      comment
      type
      createdAt
    }
  }
`;
