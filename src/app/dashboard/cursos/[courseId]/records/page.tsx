import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fetchCourseById, fetchUserInfo } from "@/lib/google/googleapis";
import { ActivityRecord } from "@/lib/types/course";
import Link from "next/link";
import { useState, useMemo } from "react";
import RecordsContent from "./content";
import { mapActivityRecordToData } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const getRecords = async (courseId: string): Promise<ActivityRecord[]> => {
  const records: ActivityRecord[] = [];

  const q = query(
    collection(db, "activityrecord"),
    where("courseId", "==", courseId)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const record = doc.data() as ActivityRecord;
    record.id = doc.id;
    records.push(record);
  });

  return records;
};

const getUserUIds = (records: ActivityRecord[]): string[] => {
  return Array.from(
    new Set(
      records
        .flatMap((record) => [record.openedBy, record.closedBy])
        .filter((id) => id !== undefined)
    )
  );
};

const fetchUserNames = async (
  userDocId: string
): Promise<Record<string, string | undefined>> => {
  try {
    const userDoc = await getDoc(doc(db, "campususer", userDocId));
    if (userDoc.exists()) {
      const gsuiteId = userDoc.data()?.gsuiteId as string | undefined;
      if (gsuiteId) {
        const userInfo = await fetchUserInfo(gsuiteId);
        return { [userDocId]: userInfo.name?.fullName ?? undefined };
      }
    }
    return {};
  } catch (err) {
    console.error(`Error fetching user info for ${userDocId}:`, err);
    return {};
  }
};

export default async function RecordsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const courseId = params.courseId;
  const [records, course] = await Promise.all([
    getRecords(courseId),
    fetchCourseById(courseId),
  ]);
  const userIds = getUserUIds(records);
  const userNames = await Promise.all(userIds.map(fetchUserNames));
  const plainRecords = records.map(mapActivityRecordToData);
  return (
    <div className="flex flex-col gap-5 w-full">
      <h1 className="text-xl font-bold flex justify-between items-center">
        <span className="text-gray-500">Registros de Asistencia del Curso</span>
        <span>{course.name ?? "Desconocido"}</span>
      </h1>
      <div className="flex gap-4">
        <Button asChild>
          <Link href={`/dashboard/cursos/${courseId}/records/attendance`}>
            Ver Reporte de Asistencia
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href={`/dashboard/cursos/${courseId}`}>Volver al Curso</Link>
        </Button>
      </div>
      <RecordsContent
        records={plainRecords}
        userNames={userNames.reduce((acc, curr) => ({ ...acc, ...curr }), {})}
      />
    </div>
  );
}
