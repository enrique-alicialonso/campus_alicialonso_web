import React from "react";

import PageTitle from "@/components/PageTitle";
import { fetchActiveCoursesForTeacher } from "@/lib/google/googleapis";
import { getUserEmail } from "@/lib/firebase/config/auth";
import { redirect } from "next/navigation";
import CursosContent from "./content";
import CourseList from "@/components/CourseList";

export default async function CursosPage() {
  const userEmail = await getUserEmail();
  if (!userEmail) redirect("/");
  const data = await fetchActiveCoursesForTeacher(userEmail);

  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Cursos" />
      <CourseList courses={data} />
    </div>
  );
}
