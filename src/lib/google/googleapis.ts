import { classroom_v1, google } from "googleapis";
import { guserauth, gadminauth } from "./google_auth";
import { admin_directory_v1 } from "googleapis/build/src/apis/admin/directory_v1";

const { admin, classroom } = google;

export const fetchUserInfo = async (
  userKey: string
): Promise<admin_directory_v1.Schema$User> => {
  const response = await admin({
    version: "directory_v1",
    auth: gadminauth,
  }).users.get({
    userKey,
    projection: "full",
  });

  return response.data;
};

export const fetchActiveCoursesForTeacher = async (
  userKey: string
): Promise<classroom_v1.Schema$Course[]> => {
  try {
    const response = await classroom({
      version: "v1",
      auth: guserauth(userKey),
    }).courses.list({ teacherId: "me", courseStates: ["ACTIVE"] });
    return response.data.courses || [];
  } catch (error) {
    console.error("Error fetching active courses:", error);
    return [];
  }
};

export const fetchCourseById = async (
  courseId: string
): Promise<classroom_v1.Schema$Course> => {
  const response = await classroom({
    version: "v1",
    auth: gadminauth,
  }).courses.get({ id: courseId });
  return response.data;
};

export const fetchCourseStudents = async (
  courseId: string
): Promise<classroom_v1.Schema$Student[]> => {
  const response = await classroom({
    version: "v1",
    auth: gadminauth,
  }).courses.students.list({ courseId });
  return response.data.students || [];
};

export const fetchCourseTeachers = async (
  courseId: string
): Promise<classroom_v1.Schema$Teacher[]> => {
  const response = await classroom({
    version: "v1",
    auth: gadminauth,
  }).courses.teachers.list({ courseId });
  return response.data.teachers || [];
};
