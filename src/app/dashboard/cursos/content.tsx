"use client";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { classroom_v1 } from "googleapis/build/src/apis/classroom/v1";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type CursosContentProps = {
  data: classroom_v1.Schema$Course[];
};

export default function CursosContent({ data }: CursosContentProps) {
  const columns: ColumnDef<classroom_v1.Schema$Course>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <p className="text-xs text-gray-400">{row.getValue("id")}</p>
      ),
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <p className="font-bold">{row.getValue("name")}</p>,
    },
    {
      accessorKey: "section",
      header: "Sección",
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "teacherCount",
      header: "Profesores",
    },
    {
      accessorKey: "studentCount",
      header: "Estudiantes",
    },
    {
      accessorKey: "details",
      header: "",
      cell: ({ row }) => {
        return (
          <Link href={`/dashboard/cursos/${row.getValue("id")}`}>
            <ChevronRight />
          </Link>
        );
      },
    },
  ];
  return <DataTable columns={columns} data={data} />;
}
