import { Query, Mutation, Resolver,  Arg, Args } from "type-graphql";
import { Attendance } from "../entities/attendance";
import { getRepository } from "typeorm";
import { SaveAttendanceArgs } from "@src/entities/argTypes";

@Resolver(Attendance)
export class AttendancesResolver {

  @Query(() => [Attendance])
  async getClassAttendance(@Arg("roomId") roomId: string):Promise<Attendance[]> {
    const attendance = await getRepository(Attendance).find({ roomId });
    return attendance;
  }

  @Query(() => [Attendance])
  async getUserAttendance(@Arg("userId") userId: string): Promise<Attendance[]> {
    const attendance = await getRepository(Attendance).find({ userId });
    return attendance;
  }

  @Mutation(() => Attendance)
  async saveAttendance(
    @Args() {roomId, userId, sessionId, joinTimestamp, leaveTimestamp }: SaveAttendanceArgs
  ): Promise<Attendance> {

    const attendance = new Attendance();
    try {
      attendance.sessionId = sessionId;
      attendance.joinTimestamp = joinTimestamp;
      attendance.leaveTimestamp = leaveTimestamp;
      attendance.roomId = roomId;
      attendance.userId = userId;
      await attendance.save();
      console.log("logAttendance", attendance);
      
    } catch(e) {
        console.log(`Unable to save attendance: ${JSON.stringify({attendance, leaveTime: Date.now()})}`);
        console.log(e);
        
    }
    return attendance;
  }
}
