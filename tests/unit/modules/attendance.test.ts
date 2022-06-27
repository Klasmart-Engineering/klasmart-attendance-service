import { AttendancesResolver } from "../../../src/modules/attendance";
import { attendanceMockData } from "../../mockData/resolverMock";
import { SaveAttendanceArgs } from "../../../src/entities/argTypes";
import { connection, attendanceService } from "../../../src/index";
import { getUniqueId } from "../../mockData/functions";

const attendancesResolver = new AttendancesResolver();
const studentData = attendanceMockData() as SaveAttendanceArgs;

describe("modules", () => {
    describe("attendance", () => {
        describe("saveAttendance", () => {
            it("should save attendance and return saved attendance", async () => {
                const mockedFuncitons: any = {
                    insert: () => mockedFuncitons,
                    into: () => mockedFuncitons,
                    values: () => mockedFuncitons,
                    orIgnore: () => mockedFuncitons,
                    execute: () => studentData
                };
                const spy = jest.spyOn(connection, "createQueryBuilder");
                spy.mockImplementationOnce(() => mockedFuncitons);
                const res = await attendancesResolver.saveAttendance(studentData);
                expect(res).toMatchObject(studentData);
            });
    
            it("should resolve undefined when there is DB error", async () => {
                const res = await attendancesResolver.saveAttendance(studentData);
                expect(res).toBeUndefined();
            });
        });

        describe("sendAttendance", () => {
            // const spy = jest.spyOn(constants, "attendanceService");
            it("should resolve falsy when there is an DB error", async () => {
                
                const spy = jest.spyOn(attendanceService, "send");
                spy.mockImplementationOnce(() => {
                    return Promise.reject();
                });
                
                const roomId = getUniqueId();
                const response = await attendancesResolver.sendAttendance(roomId);
                expect(response).toBeFalsy();

            });

            it("should resolve truthy when everything goes ok", async () => {
                const spy = jest.spyOn(attendanceService, "send");
                spy.mockImplementationOnce(() => {
                    return Promise.resolve(true);
                });
                const roomId = getUniqueId();
                const response = await attendancesResolver.sendAttendance(roomId);
                expect(response).toBeTruthy();
            });
        });

        describe("scheduleAttendance", () => {
            it("should resolve falsy when cannot schedule attendance", async () => {
                const spy = jest.spyOn(attendanceService, "schedule");
                spy.mockImplementationOnce(() => {
                    return Promise.reject();
                });
                const roomId = getUniqueId();
                const response = await attendancesResolver.scheduleAttendance(roomId);
                expect(response).toBeFalsy();
            });
        });
    });
});
