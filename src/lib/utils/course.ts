import { classroom_v1 } from "googleapis/build/src/apis/classroom/v1";
import {
  ActivityRecord,
  ActivityRecordData,
  AttendanceConfirmationData,
  StudentAttendanceReport,
} from "../types/course";

export function mapActivityRecordToData(
  record: ActivityRecord
): ActivityRecordData {
  return {
    id: record.id,
    courseId: record.courseId,
    calendarId: record.calendarId,
    eventId: record.eventId,
    open: record.open,
    openedBy: record.openedBy,
    openedAt: record.openedAt?.toDate().toISOString(),
    closedBy: record.closedBy,
    closedAt: record.closedAt?.toDate().toISOString(),
    notes: record.notes,
    attendedBy: record.attendedBy?.map<AttendanceConfirmationData>(
      (attendance) => ({
        userId: attendance.userId,
        confirmedAt: attendance.confirmedAt?.toDate().toISOString(),
        confirmedBy: attendance.confirmedBy,
        fullName: attendance.fullName,
        confirmationStatus:
          attendance.userId == attendance.confirmedBy
            ? "selfConfirmed"
            : attendance.confirmationStatus,
        confirmationStatusDate: record.openedAt?.toDate().toISOString(),
        justificationDocId: attendance.justificationDocId,
      })
    ),
    excuses: record.excuses,
    requiredBy: record.requiredBy,
    recordGroups: record.recordGroups,
  };
}

export function generateAttendanceReport(
  students: classroom_v1.Schema$Student[],
  activityRecords: ActivityRecordData[]
): { [studentId: string]: StudentAttendanceReport } {
  const report: { [studentId: string]: StudentAttendanceReport } = {};

  //= Create default attendance confirmation data for a record
  const createDefaultAttendance = (
    userId: string,
    fullName: string
  ): AttendanceConfirmationData => ({
    userId,
    fullName,
    confirmationStatus: "none",
    confirmedAt: "",
    confirmedBy: "",
    confirmationStatusDate: "",
  });

  //= Initialize report object with students
  students.forEach((student) => {
    if (!student.userId || !student.profile?.name?.fullName) return;
    report[student.userId] = {
      fullName: student.profile.name.fullName,
      attendance: [],
    };
  });

  //= Process each activity record for each student
  activityRecords.forEach((record) => {
    students.forEach((student) => {
      if (!student.userId || !student.profile?.name?.fullName) return;
      const existingAttendance = record.attendedBy?.find(
        (attendance) => attendance.userId === student.userId
      );

      const attendanceData = existingAttendance
        ? {
            userId: existingAttendance.userId,
            fullName:
              existingAttendance.fullName || student.profile?.name?.fullName,
            confirmedAt:
              Date.parse(existingAttendance.confirmedAt || "").toString() || "",
            confirmedBy: existingAttendance.confirmedBy || "",
            confirmationStatus: existingAttendance.confirmationStatus || "none",
            confirmationStatusDate:
              Date.parse(existingAttendance.confirmedAt || "").toString() || "",
            justificationDocId: existingAttendance.justificationDocId,
          }
        : createDefaultAttendance(
            student.userId,
            student.profile.name.fullName
          );

      report[student.userId].attendance.push(attendanceData);
    });
  });

  //= Sort attendance arrays by confirmedAt date
  Object.values(report).forEach((studentReport) => {
    studentReport.attendance.sort((a, b) => {
      const dateA = a.confirmedAt ? new Date(a.confirmedAt).getTime() : 0;
      const dateB = b.confirmedAt ? new Date(b.confirmedAt).getTime() : 0;
      return dateB - dateA; // Descending order (most recent first)
    });
  });

  return report;
}

export function calculateAttendancePercentage(
  attendance: AttendanceConfirmationData[]
): number {
  const validStatuses = [
    "manuallyConfirmed",
    "selfConfirmed",
    "confirmedByUnknown",
    "justified",
  ];
  const totalRecords = attendance.length;
  if (totalRecords === 0) return 0;

  const attendedRecords = attendance.filter((a) =>
    validStatuses.includes(a.confirmationStatus || "none")
  ).length;

  return (attendedRecords / totalRecords) * 100;
}

export function prepareAttendanceReportForExcel(
  report: { [studentId: string]: StudentAttendanceReport },
  records: ActivityRecordData[]
): any[][] {
  console.log("Preparing Excel data with:", {
    reportKeys: Object.keys(report),
    recordsCount: records.length,
  });

  // Create header row
  const headerRow = [
    "Nombre Completo",
    "Porcentaje de Asistencia",
    ...records.map((record) =>
      record.openedAt
        ? new Date(record.openedAt).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
          })
        : "Registro"
    ),
  ];

  console.log("Header row:", headerRow);

  // Create data rows
  const dataRows = Object.values(report).map((student) => {
    const percentage = calculateAttendancePercentage(student.attendance);
    const statusMap: { [key: string]: string } = {
      none: "❓",
      manuallyConfirmed: "✅",
      selfConfirmed: "🙌",
      confirmedByUnknown: "✅",
      justified: "📝",
      absent: "❌",
    };

    const row = [
      student.fullName,
      Math.round(percentage), // Round to whole number
      ...student.attendance.map(
        (a) => statusMap[a.confirmationStatus || "none"]
      ),
    ];

    console.log("Data row for student:", {
      name: student.fullName,
      rowLength: row.length,
      row,
    });

    return row;
  });

  const result = [headerRow, ...dataRows];
  console.log("Final data structure:", {
    totalRows: result.length,
    firstRowLength: result[0]?.length,
    secondRowLength: result[1]?.length,
    isArray: Array.isArray(result),
    isArrayOfArrays: result.every((row) => Array.isArray(row)),
  });

  return result;
}
