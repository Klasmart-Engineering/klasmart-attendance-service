export const SAVE_ATTENDANCE_MUTATION = `
mutation saveAttendance($userId: String!, $leaveTimestamp: DateTime!, $joinTimestamp: DateTime!, $sessionId: String!, $roomId: String!) {
    saveAttendance(userId: $userId, leaveTimestamp: $leaveTimestamp, joinTimestamp: $joinTimestamp, sessionId: $sessionId, roomId: $roomId) {
      roomId,
      userId,
      sessionId,
      joinTimestamp,
      leaveTimestamp,
    }
}`;