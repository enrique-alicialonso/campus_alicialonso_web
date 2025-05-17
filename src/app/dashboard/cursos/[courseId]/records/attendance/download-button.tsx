"use client";

import { Button } from "@/components/ui/button";
import { ActivityRecordData, StudentAttendanceReport } from "@/lib/types";
import { prepareAttendanceReportForExcel } from "@/lib/utils/course";

interface DownloadButtonProps {
  courseName: string;
  attendanceReport: { [studentId: string]: StudentAttendanceReport };
  records: ActivityRecordData[];
}

export default function DownloadButton({
  courseName,
  attendanceReport,
  records,
}: DownloadButtonProps) {
  const handleDownloadCSV = () => {
    const data = prepareAttendanceReportForExcel(attendanceReport, records);

    // Convert data to CSV format
    const csvContent = data
      .map((row) =>
        row
          .map((cell) => {
            // Handle special characters and wrap in quotes if needed
            const cellStr = String(cell);
            if (
              cellStr.includes(",") ||
              cellStr.includes('"') ||
              cellStr.includes("\n")
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(",")
      )
      .join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Reporte_Asistencia_${courseName || "Curso"}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleDownloadCSV}>Descargar Reporte de Asistencia</Button>
  );
}
