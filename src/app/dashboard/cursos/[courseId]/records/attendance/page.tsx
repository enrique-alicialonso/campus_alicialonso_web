import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  fetchCourseById,
  fetchCourseStudents,
  fetchUserInfo,
} from "@/lib/google/googleapis";
import { ActivityRecord } from "@/lib/types/course";
import AttendanceContent from "./content";
import { mapActivityRecordToData } from "@/lib/utils";
import { generateAttendanceReport } from "@/lib/utils/course";
import DownloadButton from "./download-button";

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

export default async function AttendancePage({
  params,
}: {
  params: { courseId: string };
}) {
  const courseId = params.courseId;
  const [records, students, course] = await Promise.all([
    getRecords(courseId),
    fetchCourseStudents(courseId),
    fetchCourseById(courseId),
  ]);
  const plainRecords = records.map(mapActivityRecordToData);
  const attendanceReport = generateAttendanceReport(students, plainRecords);

  return (
    <div className="flex flex-col gap-5 w-full">
      <h1 className="text-xl font-bold">
        <span className="text-gray-500">Reporte de Asistencia del Curso</span>{" "}
        {course.name ?? "Desconocido"}
      </h1>
      <div className="flex gap-4">
        <DownloadButton
          courseName={course.name ?? "Curso"}
          attendanceReport={attendanceReport}
          records={plainRecords}
        />
      </div>
      <AttendanceContent records={plainRecords} students={students} />
    </div>
  );
}
