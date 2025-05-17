"use client";

import React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarIcon, BookOpenIcon, UsersIcon, ClockIcon } from "lucide-react";
import { classroom_v1 } from "googleapis/build/src/apis/classroom/v1";

interface CourseListProps {
  courses: classroom_v1.Schema$Course[];
}

export default function CourseList(
  { courses }: CourseListProps = { courses: [] }
) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {courses.map((course, index) => (
          <AccordionItem value={`item-${index}`} key={course.id}>
            <AccordionTrigger>
              <div className="flex justify-between w-full">
                <span className="font-semibold">{course.name}</span>
                <span className="text-sm text-muted-foreground pr-4">
                  {course.section} {course.room && ` - ${course.room}`}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-4 space-y-4 bg-slate-50">
                {course.descriptionHeading && (
                  <h3 className="text-lg font-semibold">
                    {course.descriptionHeading}
                  </h3>
                )}
                {course.description && (
                  <p className="text-sm">{course.description}</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm">
                      ID: {course.calendarId?.slice(0, 20) ?? "No ID"}...
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpenIcon className="w-4 h-4" />
                    <span className="text-sm">State: {course.courseState}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-4 h-4" />
                    <span className="text-sm">
                      Group:{" "}
                      {course.courseGroupEmail?.slice(0, 20) ?? "No Group"}...
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4" />
                    <span className="text-sm">
                      Created:{" "}
                      {new Date(course.creationTime || "").toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <Link
                    href={course.alternateLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">Ver en Classroom</Button>
                  </Link>
                  <Link href={`/dashboard/cursos/${course.id}/records`}>
                    <Button>Ver Registros de Asistencia</Button>
                  </Link>
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
