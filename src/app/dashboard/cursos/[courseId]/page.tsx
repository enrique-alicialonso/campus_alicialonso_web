import Link from "next/link";
import { fetchCourseById } from "@/lib/google/googleapis";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { classroom_v1 } from "googleapis";

type CourseDetailsPageProps = {
  params: {
    courseId: string;
  };
};

type CourseDetailsPageData = {
  course: classroom_v1.Schema$Course;
  attendanceRecordCount: number;
};

async function getCoursePageData(
  courseId: string
): Promise<CourseDetailsPageData | undefined> {
  try {
    const course = await fetchCourseById(courseId);

    // Fetch attendance record count
    const q = query(
      collection(db, "activityrecord"),
      where("courseId", "==", courseId)
    );
    const querySnapshot = await getDocs(q);
    const attendanceRecordCount = querySnapshot.size;

    return {
      course,
      attendanceRecordCount,
    };
  } catch (error) {
    console.error("Error fetching course data:", error);
  }
}

export default async function CourseDetailsPage({
  params: { courseId },
}: CourseDetailsPageProps) {
  const data = await getCoursePageData(courseId);

  if (!data) {
    return <div>Error fetching course data</div>;
  }

  const { course, attendanceRecordCount } = data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Course Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{course.name}</h2>
          <p className="text-gray-600">{course.section}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Course ID:</strong> {course.id}
            </p>
            <p>
              <strong>State:</strong> {course.courseState}
            </p>
            <p>
              <strong>Room:</strong> {course.room || "N/A"}
            </p>
          </div>
          <div>
            <p>
              <strong>Owner ID:</strong> {course.ownerId}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(course.creationTime || "").toLocaleString()}
            </p>
            <p>
              <strong>Updated:</strong>{" "}
              {new Date(course.updateTime || "").toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p>
            <strong>Description:</strong>
          </p>
          <p className="text-gray-700">
            {course.description || "No description available."}
          </p>
        </div>
        <div className="mt-4">
          <p>
            <strong>Enrollment Code:</strong> {course.enrollmentCode}
          </p>
          <p>
            <strong>Course Group Email:</strong> {course.courseGroupEmail}
          </p>
        </div>
        <div className="mt-6">
          <Link
            href={`/dashboard/cursos/${courseId}/records`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Attendance Records ({attendanceRecordCount})
          </Link>
        </div>
      </div>
    </div>
  );
}
