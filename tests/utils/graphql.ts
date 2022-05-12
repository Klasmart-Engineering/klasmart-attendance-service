export const SAVE_ATTENDANCE_MUTATION = `
  mutation saveAttendance($userId: String!, $isTeacher: Boolean!, $leaveTimestamp: DateTime!, $joinTimestamp: DateTime!, $sessionId: String!, $roomId: String!) {
      saveAttendance(userId: $userId, isTeacher: $isTeacher, leaveTimestamp: $leaveTimestamp, joinTimestamp: $joinTimestamp, sessionId: $sessionId, roomId: $roomId) {
        roomId,
        userId,
        isTeacher,
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
      isTeacher
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
      isTeacher
      sessionId
      joinTimestamp
      leaveTimestamp
    }
  }
`;

export const SEND_ATTENDANCE_MUTAION = `
  mutation sendAttendance($roomId: String!) {
    sendAttendance(roomId: $roomId)
  }
`;

export const SCHEDULE_ATTENDANCE_MUTATION = `
  mutation scheduleAttendance($roomId: String!) {
    scheduleAttendance(roomId: $roomId)
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
