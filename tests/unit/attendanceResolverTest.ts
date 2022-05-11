import { AttendancesResolver } from "../../src/modules/attendance";
import { attendanceMockData } from "../mockData/resolverMock";
import { SaveAttendanceArgs } from "../../src/entities/argTypes";
// import { getUniqueId } from "../mockData/functions";

export const attendanceResolverTest = () => {
  it("test AttendancesResolver.saveAttendance", async () => {

    const attendancesResolver = new AttendancesResolver();
    const studentData = attendanceMockData() as SaveAttendanceArgs;
    const res = await attendancesResolver.saveAttendance(studentData);
    expect(res).toMatchObject(studentData);
  })
}