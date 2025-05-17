"use client";

import { ActivityRecordData, StudentAttendanceReport } from "@/lib/types";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { classroom_v1 } from "googleapis/build/src/apis/classroom/v1";
import { generateAttendanceReport } from "@/lib/utils/course";

export default function RecordsContent({
  records,
  students,
}: {
  records: ActivityRecordData[];
  students: classroom_v1.Schema$Student[];
}) {
  const attendanceReport = generateAttendanceReport(students, records);

  const columns: ColumnDef<StudentAttendanceReport>[] = [
    {
      accessorKey: "fullName",
      header: "Nombre Completo",
      size: 400,
    },
    ...records.map((record, index) => ({
      id: `attendance-${index}`,
      accessorFn: (row: StudentAttendanceReport) => row.attendance[index],
      header: () => {
        const date = record.openedAt
          ? new Date(record.openedAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
            })
          : `Registro ${index + 1}`;
        return date;
      },
      cell: ({ getValue }: { getValue: () => any }) => {
        const attendance = getValue() as {
          confirmationStatus:
            | "none"
            | "manuallyConfirmed"
            | "selfConfirmed"
            | "confirmedByUnknown"
            | "justified"
            | "absent";
        };
        return (
          <div className="text-center">
            {attendance.confirmationStatus === "none" && "❓"}
            {attendance.confirmationStatus === "manuallyConfirmed" && "✅"}
            {attendance.confirmationStatus === "selfConfirmed" && "🙌"}
            {attendance.confirmationStatus === "confirmedByUnknown" && "✅"}
            {attendance.confirmationStatus === "justified" && "📝"}
            {attendance.confirmationStatus === "absent" && "❌"}
          </div>
        );
      },
      size: 100,
    })),
  ];

  // Convert the report object to an array for the DataTable
  const tableData = Object.values(attendanceReport);

  return <DataTable columns={columns} data={tableData} />;
}
