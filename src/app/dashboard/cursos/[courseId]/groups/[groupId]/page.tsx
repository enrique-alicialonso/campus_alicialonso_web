import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/lib/firebase/config/firebase";
import CourseGroupSettingsContent from "./content";
import { fetchCourseStudents } from "@/lib/google/googleapis";
import { classroom_v1 } from "googleapis";

type CourseGroupSettingsProps = {
  params: {
    courseId: string;
    groupId: string;
  };
};

export default async function CourseGroupSettings({
  params,
}: CourseGroupSettingsProps) {
  const { courseId, groupId } = params;
  const db = getFirestore(app);

  // Fetch course data from Firestore
  const courseDocRef = doc(db, "coursedata", courseId);
  const courseDocSnap = await getDoc(courseDocRef);

  if (!courseDocSnap.exists()) {
    throw new Error("Course not found");
  }

  const courseData = courseDocSnap.data();
  const groupData = (courseData.groups ?? []).find(
    (group: any) => group?.groupId === groupId
  );

  if (!groupData) return { notFound: true };

  // Fetch course students
  const availableStudents = await fetchCourseStudents(courseId);
  const courseStudents = availableStudents
    .map<classroom_v1.Schema$UserProfile | undefined>((s) => s.profile)
    .filter((s): s is classroom_v1.Schema$UserProfile => s !== undefined);

  return (
    <CourseGroupSettingsContent
      courseId={courseId}
      groupId={groupId}
      initialGroupData={groupData}
      courseStudents={courseStudents}
    />
  );
}
