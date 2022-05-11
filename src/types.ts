export interface Session {
  id: string;
  userId: string;
  name: string;
  streamId: string;
  isTeacher: boolean;
  isHost: boolean;
  joinedAt: number;
  email: string;
}

export type RoomContext = {
  classType: ClassType;
  startAt: number;
  endAt: number;
}

export type AttendanceRequestType = {
  attendance_ids: string [],
  class_end_time: number,
  class_length: number,
  schedule_id: string,
}

export enum FeedbackType {
  LeaveClass = "leave_class",
  EndClass = "end_class",
}

export enum QuickFeedbackType {
  Video = "video",
  Audio = "audio",
  Presentation = "presentation",
  Other = "other",
}

export enum ClassType {
  LIVE = "live",
  CLASS = "class",
  STUDY = "study",
  TASK = "task"
}

