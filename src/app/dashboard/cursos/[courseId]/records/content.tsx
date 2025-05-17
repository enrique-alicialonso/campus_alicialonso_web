"use client";

import { ActivityRecordData } from "@/lib/types";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

export default function RecordsContent({
  records,
  userNames,
}: {
  records: ActivityRecordData[];
  userNames: Record<string, string | undefined>;
}) {
  const sortedRecords = [...records].sort((a, b) => {
    const dateA = a.openedAt ? new Date(a.openedAt).getTime() : 0;
    const dateB = b.openedAt ? new Date(b.openedAt).getTime() : 0;
    return dateB - dateA;
  });
  const columns: ColumnDef<ActivityRecordData>[] = [
    {
      accessorKey: "open",
      header: "Estado",
      cell: ({ row }) => (row.getValue("open") ? "Abierto" : "Cerrado"),
    },
    {
      accessorKey: "openedBy",
      header: "Abierto por",
      cell: ({ row }) =>
        userNames[(row.getValue("openedBy") as string | undefined) ?? "_"] ||
        "…",
    },
    {
      accessorKey: "openedAt",
      header: "Abierto el",
      cell: ({ row }) => {
        const date = row.getValue("openedAt");
        return date
          ? new Date(date as string).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "…";
      },
    },
    {
      accessorKey: "closedBy",
      header: "Cerrado por",
      cell: ({ row }) =>
        userNames[(row.getValue("closedBy") as string | undefined) ?? "_"] ||
        "automático",
    },
    {
      accessorKey: "closedAt",
      header: "Cerrado el",
      cell: ({ row }) => {
        const date = row.getValue("closedAt");
        return date
          ? new Date(date as string).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "…";
      },
    },
    {
      accessorKey: "attendedBy",
      header: "Asistencia",
      cell: ({ row }) => {
        const attendedBy = row.getValue(
          "attendedBy"
        ) as ActivityRecordData["attendedBy"];
        return attendedBy?.length || 0;
      },
    },
    // {
    //   accessorKey: "requiredBy",
    //   header: "Required By",
    //   cell: ({ row }) => {
    //     const requiredBy = row.getValue("requiredBy") as string[];
    //     return requiredBy?.join(", ") || "…";
    //   },
    // },
    // {
    //   accessorKey: "recordGroups",
    //   header: "Record Groups",
    //   cell: ({ row }) => {
    //     const groups = row.getValue("recordGroups") as string[];
    //     return groups?.join(", ") || "…";
    //   },
    // },
    {
      accessorKey: "notes",
      header: "Notas",
    },
  ];

  return <DataTable columns={columns} data={sortedRecords} />;
}
