import { Query, Mutation, Resolver,  Arg, Args } from "type-graphql";
import { Attendance } from "../entities/attendance";
import { getRepository, getConnection } from "typeorm";
import { SaveAttendanceArgs } from "../entities/argTypes";
import { attendanceService } from "../index";
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
    @Args() {roomId, userId, sessionId, isTeacher, joinTimestamp, leaveTimestamp }: SaveAttendanceArgs
  ): Promise<Attendance|undefined> {

      const attendance = new Attendance();
      try {
          attendance.sessionId = sessionId;
          attendance.joinTimestamp = joinTimestamp;
          attendance.leaveTimestamp = leaveTimestamp;
          attendance.roomId = roomId;
          attendance.userId = userId;
          attendance.isTeacher = isTeacher;
          await getConnection().createQueryBuilder()
              .insert()
              .into(Attendance)
              .values(attendance)
              .orIgnore()
              .execute();
        console.log("logAttendance", attendance);
        return attendance;
      } catch(e) {
          console.log(`Unable to save attendance: ${JSON.stringify({attendance, leaveTime: Date.now()})}`);
          console.log(e);

      }
      return;
  }

  @Mutation(() => Boolean)
  async sendAttendance(
    @Arg("roomId", {nullable: false})  roomId: string 
  ): Promise<boolean> {
      try{
          console.log("sendAttendance: ", roomId);
          const res = await attendanceService.send(roomId);
          return res;
      }catch (e) {
          console.log("Error while sending attendance to CMS sevice: ", e);
          return false;
      }
  }

  @Mutation(() => Boolean)
  async scheduleAttendance(
    @Arg("roomId", {nullable: false})  roomId: string
  ): Promise<boolean> {
      try{
          console.log("scheduleAttenance: ", roomId);
          const res = await attendanceService.schedule(roomId);
          return res;
      } catch (e) {
          console.log("Error while adding class to scheduler: ", e);
          return false;
      }
  }
}
