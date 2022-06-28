import { Query, Mutation, Resolver,  Arg, Args } from "type-graphql";
import { Attendance } from "../entities/attendance";
import { SaveAttendanceArgs } from "../entities/argTypes";
import { attendanceService, connection } from "../index";
@Resolver(Attendance)
export class AttendancesResolver {

  @Query(() => [Attendance])
    async getClassAttendance(@Arg("roomId") roomId: string):Promise<Attendance[]> {
        const attendance = await connection.getRepository(Attendance).find({ where: {roomId} });
        return attendance;
    }

  @Query(() => [Attendance])
  async getUserAttendance(@Arg("userId") userId: string): Promise<Attendance[]> {
      const attendance = await connection.getRepository(Attendance).find({ where: {userId} });
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
          await connection.createQueryBuilder()
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
